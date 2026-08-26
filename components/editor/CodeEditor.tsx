"use client";

import dynamic from "next/dynamic";
import { useProjectStore } from "@/stores/projectStore";
import { Loader2 } from "lucide-react";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    ),
  }
);

export function CodeEditor() {
  const { files, activeFile, updateFile } = useProjectStore();

  if (!activeFile || !files[activeFile]) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900">
        <p className="text-sm text-gray-500">
          Select a file from the tree, or start chatting with AI to generate
          code.
        </p>
      </div>
    );
  }

  const file = files[activeFile];
  const language = getLanguageFromPath(activeFile);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b bg-gray-800 px-3 py-1.5">
        <span className="text-xs text-gray-300">{activeFile}</span>
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
            fontFamily: "Menlo, Monaco, 'Courier New', monospace",
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
