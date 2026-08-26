// ============================================
// Shared TypeScript Types
// ============================================

// ---------- User / Profile ----------
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "pro" | "team";
  credits_remaining: number;
  created_at: string;
  updated_at: string;
}

// ---------- Files ----------
export interface ProjectFile {
  path: string;
  content: string;
  visible: boolean;
}

// ---------- Project ----------
export type ProjectStatus = "draft" | "deployed" | "archived";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  deployed_url: string | null;
  template_id: string | null;
  files: Record<string, { content: string; visible: boolean }>;
  framework: string;
  created_at: string;
  updated_at: string;
}

// ---------- Chat Messages ----------
export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  project_id: string;
  role: MessageRole;
  content: string;
  files_changed: string[];
  tokens_used: number;
  created_at: string;
}

// ---------- Deployments ----------
export type DeploymentStatus = "pending" | "building" | "success" | "failed";

export interface Deployment {
  id: string;
  project_id: string;
  version: number;
  status: DeploymentStatus;
  deploy_url: string | null;
  build_log: string | null;
  files_snapshot: Record<string, { content: string; visible: boolean }> | null;
  created_at: string;
}

// ---------- Templates ----------
export interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  thumbnail_url: string | null;
  files: Record<string, { content: string; visible: boolean }>;
  created_at: string;
}

// ---------- AI Streaming Events ----------
export type StreamEvent =
  | { type: "prose"; content: string }
  | { type: "file"; path: string; content: string }
  | { type: "error"; message: string }
  | { type: "done"; tokens_used: number };

// ---------- API Request/Response ----------
export interface GenerateRequest {
  projectId: string;
  message: string;
}

export interface DeployRequest {
  projectId: string;
}

export interface DeployResponse {
  url: string;
  version: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  templateId?: string;
}
