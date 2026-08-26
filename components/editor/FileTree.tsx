"use client";

import { useMemo } from "react";
import { File, FileCode, FileText, Plus } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { cn } from "@/lib/utils";

export function FileTree() {
  const { files, activeFile, setActiveFile } = useProjectStore();

  const sortedFiles = useMemo(() => {
    return Object.keys(files).sort();
  }, [files]);

  function getFileIcon(path: string) {
    if (path.endsWith(".tsx") || path.endsWith(".jsx")) {
      return <FileCode className="h-3.5 w-3.5 text-blue-500" />;
    } else if (path.endsWith(".ts") || path.endsWith(".js")) {
      return <FileCode className="h-3.5 w-3.5 text-yellow-500" />;
    } else if (path.endsWith(".css")) {
      return <FileText className="h-3.5 w-3.5 text-pink-500" />;
    } else {
      return <File className="h-3.5 w-3.5 text-gray-500" />;
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-xs font-semibold uppercase text-gray-500">
          Files
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {sortedFiles.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-gray-400">
            No files yet. Start chatting with AI to generate code.
          </div>
        ) : (
          sortedFiles.map((path) => (
            <button
              key={path}
              onClick={() => setActiveFile(path)}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-gray-100",
                activeFile === path && "bg-indigo-50 text-indigo-700"
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
