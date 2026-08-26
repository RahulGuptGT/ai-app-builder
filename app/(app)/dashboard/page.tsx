"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  LogOut,
  ExternalLink,
  Trash2,
  Loader2,
  Clock,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";
import type { Project } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading, initialize, signOut } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  async function fetchProjects() {
    setLoadingProjects(true);
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("projects")
      .select(
        "id, name, description, status, deployed_url, framework, created_at, updated_at"
      )
      .eq("user_id", user!.id)
      .order("updated_at", { ascending: false });
    setProjects((data as Project[]) || []);
    setLoadingProjects(false);
  }

  async function createProject(name: string, templateId?: string) {
    const supabase = getSupabaseBrowser();
    let files: Record<string, { content: string; visible: boolean }> = {};

    if (templateId) {
      const { data: template } = await supabase
        .from("templates")
        .select("files")
        .eq("id", templateId)
        .single();
      if (template) {
        files = template.files as Record<string, { content: string; visible: boolean }>;
      }
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user!.id,
        name,
        template_id: templateId || null,
        files,
      })
      .select()
      .single();

    if (data) {
      router.push(`/project/${data.id}`);
    }
  }

  async function deleteProject(id: string) {
    const supabase = getSupabaseBrowser();
    await supabase.from("projects").delete().eq("id", id);
    setProjects(projects.filter((p) => p.id !== id));
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0f] text-white grid-bg">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[300px] w-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#12121a]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">AppBuilder</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
              <Zap className="h-3 w-3 text-indigo-400" />
              {profile?.credits_remaining ?? 0} credits
            </div>
            <span className="hidden text-sm text-gray-400 sm:block">{profile?.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-sm text-gray-500 transition hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
            <p className="mt-1 text-sm text-gray-400">
              Build and deploy apps with AI
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>

        {/* Projects grid */}
        {loadingProjects ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : projects.length === 0 ? (
          <div className="gradient-border flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Sparkles className="h-8 w-8 text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-200">
              No projects yet
            </h2>
            <p className="mt-1 max-w-xs text-sm text-gray-500">
              Create your first app by describing what you want to build
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="gradient-border group p-5 transition hover:border-indigo-500/30"
              >
                <Link href={`/project/${project.id}`} className="block">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        project.status === "deployed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {project.status}
                    </span>
                    <Clock className="h-3.5 w-3.5 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-100 transition group-hover:text-indigo-400">
                    {project.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {project.description || "No description"}
                  </p>
                  <p className="mt-3 text-xs text-gray-600">
                    {timeAgo(project.updated_at)}
                  </p>
                </Link>
                <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                  {project.deployed_url && (
                    <a
                      href={project.deployed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-indigo-400 transition hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View deployed
                    </a>
                  )}
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="ml-auto flex items-center gap-1 text-xs text-gray-600 transition hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNewModal && (
        <NewProjectModal
          onClose={() => setShowNewModal(false)}
          onCreate={createProject}
        />
      )}
    </main>
  );
}

function NewProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, templateId?: string) => void;
}) {
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<string | undefined>(undefined);

  const templates = [
    { id: undefined, name: "Blank", desc: "Start from scratch", icon: "📄" },
    { id: "blank-react", name: "React Starter", desc: "Minimal React app", icon: "⚛️" },
    { id: "landing-page", name: "Landing Page", desc: "Hero + features + CTA", icon: "🚀" },
    { id: "todo-app", name: "Todo App", desc: "Classic todo with filters", icon: "✅" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="slide-in w-full max-w-md rounded-2xl border border-white/10 bg-[#12121a] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-xl font-bold">New Project</h2>

        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Project Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome App"
          className="mb-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          autoFocus
        />

        <label className="mb-2 block text-sm font-medium text-gray-300">
          Template
        </label>
        <div className="mb-5 grid grid-cols-2 gap-2">
          {templates.map((t) => (
            <button
              key={t.name}
              onClick={() => setTemplateId(t.id)}
              className={`rounded-xl border p-3 text-left transition ${
                templateId === t.id
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-white/5 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="mb-1 block text-lg">{t.icon}</span>
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-gray-500">{t.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCreate(name || "Untitled App", templateId);
            }}
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
