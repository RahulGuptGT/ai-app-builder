import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSarvamClient } from "@/lib/sarvam/client";
import { buildSystemPrompt } from "@/lib/sarvam/prompts";
import { createStreamParser } from "@/lib/stream-parser";
import type { SarvamMessage } from "@/lib/sarvam/client";
import type { StreamEvent } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { projectId, message } = (await req.json()) as {
      projectId: string;
      message: string;
    };

    if (!projectId || !message) {
      return new Response(
        JSON.stringify({ error: "projectId and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
      });
    }

    if (project.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })
      .limit(20);

    const systemPrompt = buildSystemPrompt(project.files || {});

    const messages: SarvamMessage[] = [
      { role: "system", content: systemPrompt },
      ...((history || []) as SarvamMessage[]),
      { role: "user", content: message },
    ];

    await supabase.from("messages").insert({
      project_id: projectId,
      role: "user",
      content: message,
    });

    const sarvam = getSarvamClient();
    const parser = createStreamParser();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let assistantContent = "";
        let filesChanged: string[] = [];
        let totalTokens = 0;

        try {
          const sarvamStream = sarvam.streamChat({
            messages,
            temperature: 0.7,
            max_tokens: 8000,
          });

          for await (const chunk of sarvamStream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              const events = parser.processChunk(delta);
              for (const event of events) {
                controller.enqueue(encoder.encode(event));

                try {
                  const parsed = JSON.parse(
                    event.slice(6).trim()
                  ) as StreamEvent;
                  if (parsed.type === "file" && !filesChanged.includes(parsed.path)) {
                    filesChanged.push(parsed.path);
                  }
                  if (parsed.type === "done") {
                    totalTokens = chunk.usage?.total_tokens || 0;
                  }
                } catch {
                  // ignore parse errors
                }
              }
            }

            if (chunk.usage) {
              totalTokens = chunk.usage.total_tokens;
            }
          }

          const finalEvents = parser.finalize();
          for (const event of finalEvents) {
            controller.enqueue(encoder.encode(event));

            try {
              const parsed = JSON.parse(
                event.slice(6).trim()
              ) as StreamEvent;
              if (parsed.type === "file" && !filesChanged.includes(parsed.path)) {
                filesChanged.push(parsed.path);
              }
            } catch {
              // ignore
            }
          }

          await supabase.from("messages").insert({
            project_id: projectId,
            role: "assistant",
            content: assistantContent,
            files_changed: filesChanged,
            tokens_used: totalTokens,
          });

          if (filesChanged.length > 0) {
            await supabase
              .from("projects")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", projectId);
          }

          await supabase.rpc("decrement_credits", { p_user_id: user.id });
        } catch (error) {
          console.error("Stream error:", error);
          const errorEvent = `data: ${JSON.stringify({
            type: "error",
            message: error instanceof Error ? error.message : "Unknown error",
          })}\n\n`;
          controller.enqueue(encoder.encode(errorEvent));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
