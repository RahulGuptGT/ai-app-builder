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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-bold">AppBuilder</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile?.credits_remaining ?? 0} credits
            </span>
            <span className="text-sm text-gray-700">{profile?.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Projects</h1>
            <p className="text-sm text-gray-600">
              Build and deploy apps with AI
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>

        {loadingProjects ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
            <Sparkles className="mb-4 h-12 w-12 text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-700">
              No projects yet
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create your first app by describing what you want to build
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
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
                className="group rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <Link href={`/project/${project.id}`} className="block">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        project.status === "deployed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {project.status}
                    </span>
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                    {project.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {project.description || "No description"}
                  </p>
                  <p className="mt-3 text-xs text-gray-400">
                    {timeAgo(project.updated_at)}
                  </p>
                </Link>
                <div className="mt-4 flex items-center gap-2 border-t pt-3">
                  {project.deployed_url && (
                    <a
                      href={project.deployed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View deployed
                    </a>
                  )}
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
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
    { id: undefined, name: "Blank", desc: "Start from scratch" },
    { id: "blank-react", name: "React Starter", desc: "Minimal React app" },
    { id: "landing-page", name: "Landing Page", desc: "Hero + features + CTA" },
    { id: "todo-app", name: "Todo App", desc: "Classic todo with filters" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-bold">New Project</h2>

        <label className="mb-1.5 block text-sm font-medium">Project Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome App"
          className="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          autoFocus
        />

        <label className="mb-2 block text-sm font-medium">Template</label>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {templates.map((t) => (
            <button
              key={t.name}
              onClick={() => setTemplateId(t.id)}
              className={`rounded-lg border p-3 text-left transition ${
                templateId === t.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-gray-500">{t.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCreate(name || "Untitled App", templateId);
            }}
            className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
