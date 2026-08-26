"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Settings,
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
  const router = useRouter();

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
          className="rounded border px-2 py-0.5 text-sm outline-none focus:border-indigo-500"
          autoFocus
        />
      ) : (
        <button
          onClick={() => {
            setName(project.name);
            setEditing(true);
          }}
          className="text-sm font-medium hover:text-indigo-600"
        >
          {project.name}
        </button>
      )}

      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          project.status === "deployed"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
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
            className="flex items-center gap-1 text-xs text-green-600 hover:underline"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Deployed
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {deployStatus === "error" && (
          <span className="text-xs text-red-600">Deploy failed</span>
        )}

        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
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
