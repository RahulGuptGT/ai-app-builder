"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LogOut, Loader2, ChevronLeft } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0f] text-white">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-white/5 bg-[#12121a] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-400 transition hover:text-white"
            title="Back to dashboard"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold">AppBuilder</span>
          </Link>
          <span className="text-gray-700">/</span>
          <ProjectHeader />
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-gray-500 sm:block">{user.email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-1 text-xs text-gray-500 transition hover:text-white"
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Main 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat Panel */}
        <div className="w-80 shrink-0 border-r border-white/5 bg-[#12121a]">
          <ChatPanel />
        </div>

        {/* Middle: Code Editor + File Tree */}
        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 shrink-0 border-r border-white/5 bg-[#0e0e16]">
            <FileTree />
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-[420px] shrink-0 border-l border-white/5 bg-white">
          <LivePreview />
        </div>
      </div>
    </div>
  );
}
