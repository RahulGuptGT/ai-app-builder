import type { StreamEvent } from "@/types";

// ============================================
// Stream Parser — Converts Sarvam stream into SSE events
// ============================================

/**
 * Takes a stream of text chunks and emits SSE-formatted events:
 * - { type: "prose", content: "..." }  — text outside code blocks
 * - { type: "file", path: "src/App.tsx", content: "..." }  — code inside fenced blocks
 * - { type: "done" }  — stream finished
 */
export function createStreamParser() {
  let buffer = "";
  let inCodeBlock = false;
  let currentFilePath: string | null = null;
  let codeBuffer = "";
  let proseBuffer = "";

  const encoder = new TextEncoder();

  function flushProse(): string | null {
    if (proseBuffer.trim()) {
      const event = `data: ${JSON.stringify({
        type: "prose",
        content: proseBuffer,
      } as StreamEvent)}\n\n`;
      proseBuffer = "";
      return event;
    }
    proseBuffer = "";
    return null;
  }

  function flushFile(): string | null {
    if (currentFilePath && codeBuffer) {
      const event = `data: ${JSON.stringify({
        type: "file",
        path: currentFilePath,
        content: codeBuffer,
      } as StreamEvent)}\n\n`;
      currentFilePath = null;
      codeBuffer = "";
      return event;
    }
    return null;
  }

  function processChunk(chunk: string): string[] {
    buffer += chunk;
    const events: string[] = [];

    while (buffer.length > 0) {
      if (!inCodeBlock) {
        const fenceMatch = buffer.match(/```(\w*):([^\n]+)\n/);
        if (fenceMatch) {
          const proseBefore = buffer.slice(0, fenceMatch.index);
          proseBuffer += proseBefore;
          const proseEvent = flushProse();
          if (proseEvent) events.push(proseEvent);

          inCodeBlock = true;
          currentFilePath = fenceMatch[2].trim();
          codeBuffer = "";
          buffer = buffer.slice(fenceMatch.index! + fenceMatch[0].length);
        } else {
          const lastBackticks = buffer.lastIndexOf("```");
          if (lastBackticks !== -1 && lastBackticks === buffer.length - 3) {
            proseBuffer += buffer.slice(0, lastBackticks);
            const proseEvent = flushProse();
            if (proseEvent) events.push(proseEvent);
            buffer = buffer.slice(lastBackticks);
            break;
          } else if (lastBackticks !== -1) {
            const afterBackticks = buffer.slice(lastBackticks);
            if (afterBackticks.length < 20) {
              const safeEnd = lastBackticks;
              proseBuffer += buffer.slice(0, safeEnd);
              const proseEvent = flushProse();
              if (proseEvent) events.push(proseEvent);
              buffer = buffer.slice(safeEnd);
              break;
            } else {
              proseBuffer += buffer;
              const proseEvent = flushProse();
              if (proseEvent) events.push(proseEvent);
              buffer = "";
              break;
            }
          } else {
            if (buffer.length > 5) {
              const safe = buffer.slice(0, -3);
              proseBuffer += safe;
              buffer = buffer.slice(-3);
            }
            break;
          }
        }
      } else {
        const closeIdx = buffer.indexOf("```");
        if (closeIdx !== -1) {
          codeBuffer += buffer.slice(0, closeIdx);
          buffer = buffer.slice(closeIdx + 3);
          if (buffer.startsWith("\n")) buffer = buffer.slice(1);
          inCodeBlock = false;
          const fileEvent = flushFile();
          if (fileEvent) events.push(fileEvent);
        } else {
          if (buffer.length > 3) {
            codeBuffer += buffer.slice(0, -3);
            buffer = buffer.slice(-3);
          }
          break;
        }
      }
    }

    return events;
  }

  function finalize(): string[] {
    const events: string[] = [];

    if (inCodeBlock && currentFilePath) {
      codeBuffer += buffer;
      buffer = "";
      inCodeBlock = false;
      const fileEvent = flushFile();
      if (fileEvent) events.push(fileEvent);
    } else {
      proseBuffer += buffer;
      buffer = "";
      const proseEvent = flushProse();
      if (proseEvent) events.push(proseEvent);
    }

    events.push("data: {\"type\":\"done\"}\n\n");
    return events;
  }

  return {
    processChunk,
    finalize,
    encoder,
  };
}
