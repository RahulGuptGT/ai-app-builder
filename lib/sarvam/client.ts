// ============================================
// Sarvam AI Client — Server-side only
// ============================================

export interface SarvamMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface SarvamChatRequest {
  model?: string;
  messages: SarvamMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface SarvamStreamChunk {
  choices: {
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason?: string | null;
    index: number;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class SarvamClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY!;
    this.baseUrl = process.env.SARVAM_API_URL || "https://api.sarvam.ai/v1";
  }

  async *streamChat(
    request: SarvamChatRequest
  ): AsyncGenerator<SarvamStreamChunk, void, unknown> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        model: request.model || "sarvam-105b-conversations",
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.max_tokens ?? 8000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Sarvam API error ${response.status}: ${errText}`);
    }

    if (!response.body) throw new Error("No response body from Sarvam API");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const data = trimmed.slice(6);
        if (data === "[DONE]") return;

        try {
          const chunk = JSON.parse(data) as SarvamStreamChunk;
          yield chunk;
        } catch {
          // Skip malformed chunks
        }
      }
    }
  }
}

export function getSarvamClient() {
  return new SarvamClient();
}
