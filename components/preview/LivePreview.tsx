"use client";

import { useMemo } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { Loader2, RefreshCw, Monitor, Smartphone, Tablet } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";

export function LivePreview() {
  const { files, project, isGenerating } = useProjectStore();

  const sandpackFiles = useMemo(() => {
    const result: Record<string, { code: string; hidden?: boolean }> = {};

    for (const [path, file] of Object.entries(files)) {
      const sandpackPath = path.startsWith("/") ? path : `/${path}`;
      result[sandpackPath] = {
        code: file.content,
        hidden: !file.visible,
      };
    }

    if (!result["/src/main.tsx"] && !result["/src/main.jsx"]) {
      result["/src/main.tsx"] = {
        code: `import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`,
        hidden: true,
      };
    }

    if (!result["/src/App.tsx"] && !result["/src/App.jsx"]) {
      result["/src/App.tsx"] = {
        code: `export default function App() {\n  return (\n    <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#666" }}>\n      <h2>Waiting for code...</h2>\n      <p>Describe your app in the chat to generate code.</p>\n    </div>\n  );\n}`,
      };
    }

    if (!result["/src/index.css"]) {
      result["/src/index.css"] = {
        code: `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
        hidden: true,
      };
    }

    if (!result["/public/index.html"]) {
      result["/public/index.html"] = {
        code: `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<title>Preview</title>\n</head>\n<body>\n<div id="root"></div>\n</body>\n</html>`,
        hidden: true,
      };
    }

    return result;
  }, [files]);

  const hasFiles = Object.keys(files).length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Preview header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-[#12121a] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span className="ml-2 text-xs text-gray-400">Live Preview</span>
        </div>
        {isGenerating && (
          <div className="flex items-center gap-1 text-xs text-indigo-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {/* Sandpack preview */}
      <div className="flex-1 overflow-hidden">
        {hasFiles ? (
          <Sandpack
            template="react-ts"
            files={sandpackFiles}
            options={{
              recompileMode: "delayed",
              recompileDelay: 300,
              showNavigator: false,
              showTabs: false,
              showLineNumbers: false,
              showConsoleButton: true,
              autorun: true,
              bundlerURL: undefined,
            }}
            theme="dark"
            customSetup={{
              dependencies: {
                "lucide-react": "latest",
                "framer-motion": "latest",
                "recharts": "latest",
              },
            }}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-[#0a0a0f] text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
              <RefreshCw className="h-8 w-8 text-gray-700" />
            </div>
            <p className="text-sm text-gray-500">
              Your live preview will appear here
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Start by describing your app in the chat
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
