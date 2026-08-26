"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LogOut, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useProjectStore } from "@/stores/projectStore";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { FileTree } from "@/components/editor/FileTree";
import { LivePreview } from "@/components/preview/LivePreview";
import { ProjectHeader } from "@/components/project/ProjectHeader";

export default function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, isLoading, initialize, signOut } = useAuthStore();
  const { project, loadProject } = useProjectStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      loadProject(params.id);
    }
  }, [user, params.id, loadProject]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-bold">AppBuilder</span>
          </Link>
          <span className="text-gray-300">/</span>
          <ProjectHeader />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{user.email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 border-r bg-white">
          <ChatPanel />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 shrink-0 border-r bg-gray-50">
            <FileTree />
          </div>

          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>
        </div>

        <div className="w-[420px] shrink-0 border-l bg-white">
          <LivePreview />
        </div>
      </div>
    </div>
  );
}
