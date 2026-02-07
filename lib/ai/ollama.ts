import type { AIProvider } from "./provider";

const OLLAMA_BASE = process.env.OLLAMA_URL || "http://localhost:11434";

export class OllamaProvider implements AIProvider {
  private async chat(prompt: string): Promise<string> {
    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama3.2",
        prompt,
        stream: false,
      }),
    });
    const data = await res.json();
    return data.response || "Unable to generate response.";
  }

  async summarize(content: string): Promise<string> {
    return this.chat(
      `Summarize the following content concisely in 2-3 sentences. Focus on key ideas and actionable insights.\n\n${content}`
    );
  }

  async autoTag(content: string, existingTags: string[]): Promise<string[]> {
    const existingList = existingTags.length > 0
      ? `\nExisting tags in the system (REUSE these whenever they fit): [${existingTags.join(", ")}]`
      : "";
    const response = await this.chat(
      `You are a tagging assistant. Generate tags that describe the ACTUAL CONTENT — its topic, technologies, concepts, and domain.

Rules:
- Generate 5-8 tags
- Tags must be lowercase, 1-3 words max
- Tags must be SPECIFIC to the content (e.g. "react", "machine learning", "portfolio", "gate exam", "web development")
- NEVER generate generic/vague tags like "personal", "knowledge", "information", "content", "notes", "general", "misc"
- REUSE existing tags when they genuinely match the content's topic
- Return ONLY a JSON array of strings. Example: ["react", "frontend", "css"]
${existingList}

Content to tag:
${content}`
    );
    try {
      const match = response.match(/\[[\s\S]*?\]/);
      if (!match) return [];
      const tags: string[] = JSON.parse(match[0]);
      return tags
        .map((t) => t.toLowerCase().trim())
        .filter((t) => t.length > 0 && t.length <= 50);
    } catch {
      return [];
    }
  }

  async query(question: string, context: string): Promise<string> {
    return this.chat(
      `You are a knowledge assistant. Answer questions based ONLY on the provided context. If the context doesn't contain relevant information, say so. Be concise and cite specific notes when possible.\n\nContext:\n${context}\n\nQuestion: ${question}`
    );
  }

  async extractFromImage(base64: string, prompt: string): Promise<string> {
    const model = process.env.OLLAMA_VISION_MODEL || process.env.OLLAMA_MODEL || "qwen3-vl";
    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        images: [base64],
        stream: false,
      }),
    });
    if (!res.ok) {
      throw new Error(`Ollama vision model failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.response || "";
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const res = await fetch(`${OLLAMA_BASE}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
        prompt: text,
      }),
    });
    const data = await res.json();
    return data.embedding || [];
  }
}
