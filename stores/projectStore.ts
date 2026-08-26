"use client";

import { create } from "zustand";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Project, ChatMessage, StreamEvent } from "@/types";

interface ProjectState {
  project: Project | null;
  messages: ChatMessage[];
  files: Record<string, { content: string; visible: boolean }>;
  isGenerating: boolean;
  activeFile: string | null;
  saveTimer: ReturnType<typeof setTimeout> | null;

  loadProject: (projectId: string) => Promise<void>;
  addFile: (path: string, content: string) => void;
  updateFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  setActiveFile: (path: string | null) => void;
  setGenerating: (val: boolean) => void;
  addMessage: (msg: ChatMessage) => void;
  processStreamEvent: (event: StreamEvent) => void;
  saveToSupabase: () => Promise<void>;
  renameProject: (name: string) => Promise<void>;
  saveToSupabaseDebounced: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  messages: [],
  files: {},
  isGenerating: false,
  activeFile: null,
  saveTimer: null,

  loadProject: async (projectId: string) => {
    const supabase = getSupabaseBrowser();

    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      console.error("Failed to load project:", error);
      return;
    }

    const proj = project as Project;
    set({ project: proj, files: proj.files || {} });

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    set({ messages: (messages as ChatMessage[]) || [] });

    const fileEntries = Object.entries(proj.files || {});
    if (fileEntries.length > 0) {
      const firstVisible = fileEntries.find(([, f]) => f.visible) || fileEntries[0];
      set({ activeFile: firstVisible[0] });
    }
  },

  addFile: (path: string, content: string) => {
    set((state) => ({
      files: { ...state.files, [path]: { content, visible: true } },
      activeFile: path,
    }));
    get().saveToSupabaseDebounced();
  },

  updateFile: (path: string, content: string) => {
    set((state) => {
      const existing = state.files[path];
      if (!existing) return state;
      return {
        files: {
          ...state.files,
          [path]: { ...existing, content },
        },
      };
    });
    get().saveToSupabaseDebounced();
  },

  deleteFile: (path: string) => {
    set((state) => {
      const newFiles = { ...state.files };
      delete newFiles[path];
      return {
        files: newFiles,
        activeFile:
          state.activeFile === path
            ? Object.keys(newFiles)[0] || null
            : state.activeFile,
      };
    });
    get().saveToSupabaseDebounced();
  },

  setActiveFile: (path: string | null) => set({ activeFile: path }),
  setGenerating: (val: boolean) => set({ isGenerating: val }),

  addMessage: (msg: ChatMessage) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  processStreamEvent: (event: StreamEvent) => {
    if (event.type === "file") {
      get().addFile(event.path, event.content);
    }
  },

  saveToSupabase: async () => {
    const { project, files } = get();
    if (!project) return;

    const supabase = getSupabaseBrowser();
    await supabase
      .from("projects")
      .update({ files, updated_at: new Date().toISOString() })
      .eq("id", project.id);
  },

  renameProject: async (name: string) => {
    const { project } = get();
    if (!project) return;

    set((state) => ({
      project: state.project ? { ...state.project, name } : null,
    }));

    const supabase = getSupabaseBrowser();
    await supabase
      .from("projects")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", project.id);
  },

  saveToSupabaseDebounced: () => {
    const state = get();
    if (state.saveTimer) clearTimeout(state.saveTimer);
    const timer = setTimeout(() => {
      get().saveToSupabase();
    }, 800);
    set({ saveTimer: timer });
  },
}));
