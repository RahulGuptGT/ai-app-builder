"use client";

import { useMemo } from "react";
import { File, FileCode, FileText } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { cn } from "@/lib/utils";

export function FileTree() {
  const { files, activeFile, setActiveFile } = useProjectStore();

  const sortedFiles = useMemo(() => {
    return Object.keys(files).sort();
  }, [files]);

  function getFileIcon(path: string) {
    if (path.endsWith(".tsx") || path.endsWith(".jsx")) {
      return <FileCode className="h-3.5 w-3.5 text-blue-400" />;
    } else if (path.endsWith(".ts") || path.endsWith(".js")) {
      return <FileCode className="h-3.5 w-3.5 text-yellow-400" />;
    } else if (path.endsWith(".css")) {
      return <FileText className="h-3.5 w-3.5 text-pink-400" />;
    } else {
      return <File className="h-3.5 w-3.5 text-gray-500" />;
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#0e0e16] text-white">
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Files
        </span>
        <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-600">
          {sortedFiles.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {sortedFiles.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-gray-600">
            No files yet.
            <br />
            Start chatting with AI.
          </div>
        ) : (
          sortedFiles.map((path) => (
            <button
              key={path}
              onClick={() => setActiveFile(path)}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition",
                activeFile === path
                  ? "bg-indigo-500/10 text-indigo-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {getFileIcon(path)}
              <span className="truncate">{path}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
