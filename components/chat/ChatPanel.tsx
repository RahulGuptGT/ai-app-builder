"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Bot, User as UserIcon, AlertCircle } from "lucide-react";
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
    <div className="flex h-full flex-col bg-[#12121a] text-white">
      {/* Chat header */}
      <div className="border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold">AI Chat</span>
        </div>
        <p className="mt-0.5 text-xs text-gray-500">
          <span className={credits > 10 ? "text-indigo-400" : "text-orange-400"}>{credits}</span> credits left
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !streamingText && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Sparkles className="h-7 w-7 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-gray-300">
              Describe your app
            </p>
            <p className="mt-1 max-w-[200px] text-xs text-gray-500">
              e.g., "Make a todo app with dark mode" or "Build a landing page for my SaaS"
            </p>
            {/* Quick prompts */}
            <div className="mt-6 flex flex-col gap-2">
              {["Build a todo app", "Create a landing page", "Make a calculator"].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
              msg.role === "user"
                ? "bg-indigo-500/20"
                : "bg-purple-500/20"
            }`}>
              {msg.role === "user" ? (
                <UserIcon className="h-3 w-3 text-indigo-400" />
              ) : (
                <Bot className="h-3 w-3 text-purple-400" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-indigo-500/10 text-gray-100"
                  : "bg-white/5 text-gray-300"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming text */}
        {streamingText && (
          <div className="mb-4 flex gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-purple-500/20">
              <Bot className="h-3 w-3 text-purple-400" />
            </div>
            <div className="max-w-[85%] rounded-xl bg-white/5 px-3 py-2 text-sm text-gray-300">
              {streamingText}
              <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-indigo-400" />
            </div>
          </div>
        )}

        {/* Generating indicator */}
        {isGenerating && !streamingText && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            <span className="text-gray-400">Generating code</span>
            <div className="flex gap-1">
              <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "0ms" }} />
              <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "150ms" }} />
              <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-3">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what to build..."
            disabled={isGenerating}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-4 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition hover:brightness-110 disabled:opacity-30"
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-gray-600">
          Press Enter to send • AI generates React + TypeScript code
        </p>
      </div>
    </div>
  );
}
