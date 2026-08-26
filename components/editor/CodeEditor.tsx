"use client";

import dynamic from "next/dynamic";
import { useProjectStore } from "@/stores/projectStore";
import { Loader2, FileCode2 } from "lucide-react";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
      </div>
    ),
  }
);

export function CodeEditor() {
  const { files, activeFile, updateFile } = useProjectStore();

  if (!activeFile || !files[activeFile]) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#0a0a0f] text-gray-600">
        <FileCode2 className="mb-3 h-10 w-10 text-gray-800" />
        <p className="text-sm">No file selected</p>
        <p className="mt-1 text-xs text-gray-700">
          Pick a file from the tree or generate code with AI
        </p>
      </div>
    );
  }

  const file = files[activeFile];
  const language = getLanguageFromPath(activeFile);

  return (
    <div className="flex h-full flex-col bg-[#0a0a0f]">
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/5 bg-[#12121a] px-3 py-1.5">
        <FileCode2 className="mr-2 h-3.5 w-3.5 text-indigo-400" />
        <span className="text-xs text-gray-400">{activeFile}</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={file.content}
          onChange={(value: string | undefined) => {
            if (value !== undefined) {
              updateFile(activeFile, value);
            }
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            fontFamily: "'JetBrains Mono', Menlo, Monaco, 'Courier New', monospace",
            fontLigatures: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            renderWhitespace: "selection",
            scrollbar: {
              verticalScrollbarSize: 4,
              horizontalScrollbarSize: 4,
            },
          }}
        />
      </div>
    </div>
  );
}

function getLanguageFromPath(path: string): string {
  if (path.endsWith(".tsx")) return "typescript";
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".jsx")) return "javascript";
  if (path.endsWith(".js")) return "javascript";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".md")) return "markdown";
  return "plaintext";
}
