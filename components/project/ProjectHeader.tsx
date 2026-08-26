"use client";

import { useState } from "react";
import {
  Rocket,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { cn } from "@/lib/utils";

export function ProjectHeader() {
  const { project, renameProject } = useProjectStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project?.name || "");
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(
    project?.deployed_url || null
  );
  const [deployStatus, setDeployStatus] = useState<
    "idle" | "deploying" | "success" | "error"
  >("idle");

  if (!project) return null;

  async function handleDeploy() {
    setDeploying(true);
    setDeployStatus("deploying");

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project!.id }),
      });

      if (!response.ok) throw new Error("Deploy failed");

      const data = await response.json();
      setDeployUrl(data.url);
      setDeployStatus("success");
    } catch (error) {
      console.error("Deploy error:", error);
      setDeployStatus("error");
    } finally {
      setDeploying(false);
    }
  }

  function handleSaveName() {
    if (name.trim() && name !== project?.name) {
      renameProject(name.trim());
    }
    setEditing(false);
  }

  return (
    <div className="flex items-center gap-3">
      {editing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSaveName}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveName();
            if (e.key === "Escape") {
              setName(project!.name);
              setEditing(false);
            }
          }}
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-sm text-white outline-none focus:border-indigo-500"
          autoFocus
        />
      ) : (
        <button
          onClick={() => {
            setName(project.name);
            setEditing(true);
          }}
          className="text-sm font-medium text-gray-300 transition hover:text-white"
        >
          {project.name}
        </button>
      )}

      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-medium",
          project.status === "deployed"
            ? "bg-green-500/10 text-green-400"
            : "bg-white/5 text-gray-400"
        )}
      >
        {project.status}
      </span>

      <div className="ml-2 flex items-center gap-2">
        {deployStatus === "success" && deployUrl && (
          <a
            href={deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-green-400 transition hover:underline"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Deployed
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {deployStatus === "error" && (
          <span className="text-xs text-red-400">Deploy failed</span>
        )}

        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {deploying ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Rocket className="h-3.5 w-3.5" />
          )}
          {deploying ? "Deploying..." : "Deploy"}
        </button>
      </div>
    </div>
  );
}
