"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import type { StreamEvent, ChatMessage } from "@/types";

export function ChatPanel() {
  const {
    project,
    messages,
    isGenerating,
    setGenerating,
    addMessage,
    processStreamEvent,
  } = useProjectStore();
  const { profile, refreshProfile } = useAuthStore();
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isGenerating || !project) return;

    const message = input.trim();
    setInput("");
    setStreamingText("");
    setGenerating(true);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      project_id: project.id,
      role: "user",
      content: message,
      files_changed: [],
      tokens_used: 0,
      created_at: new Date().toISOString(),
    };
    addMessage(userMsg);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let proseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (!data) continue;

          try {
            const event = JSON.parse(data) as StreamEvent;

            if (event.type === "prose") {
              proseBuffer += event.content;
              setStreamingText(proseBuffer);
            } else if (event.type === "file") {
              processStreamEvent(event);
              proseBuffer = "";
              setStreamingText("");
            } else if (event.type === "error") {
              setStreamingText(`Error: ${event.message}`);
            } else if (event.type === "done") {
              const assistantMsg: ChatMessage = {
                id: crypto.randomUUID(),
                project_id: project.id,
                role: "assistant",
                content: proseBuffer || "Code generated successfully.",
                files_changed: [],
                tokens_used: event.tokens_used || 0,
                created_at: new Date().toISOString(),
              };
              addMessage(assistantMsg);
              setStreamingText("");
              refreshProfile();
            }
          } catch {
            // skip parse errors
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setStreamingText("Sorry, something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  const credits = profile?.credits_remaining ?? 0;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-semibold">AI Chat</span>
        </div>
        <p className="mt-0.5 text-xs text-gray-500">{credits} credits left</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !streamingText && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-indigo-100 p-3">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Describe your app
            </p>
            <p className="mt-1 text-xs text-gray-500">
              e.g., "Make a todo app with dark mode"
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 ${msg.role === "user" ? "text-right" : ""}`}
          >
            <div
              className={`inline-block max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {streamingText && (
          <div className="mb-4">
            <div className="inline-block max-w-[90%] rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800">
              {streamingText}
              <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-gray-400" />
            </div>
          </div>
        )}

        {isGenerating && !streamingText && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating code...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what to build..."
            disabled={isGenerating}
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
