import OpenAI from "openai";
import type { AIProvider } from "./provider";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async summarize(content: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize the following content concisely in 2-3 sentences. Focus on key ideas and actionable insights.",
        },
        { role: "user", content },
      ],
      max_tokens: 200,
    });
    return response.choices[0]?.message?.content || "Unable to generate summary.";
  }

  async autoTag(content: string, existingTags: string[]): Promise<string[]> {
    const existingList = existingTags.length > 0
      ? `\nExisting tags in the system (REUSE these whenever they fit): [${existingTags.join(", ")}]`
      : "";
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a tagging assistant. Generate tags that describe the ACTUAL CONTENT — its topic, technologies, concepts, and domain.

Rules:
- Generate 5-8 tags
- Tags must be lowercase, 1-3 words max
- Tags must be SPECIFIC to the content (e.g. "react", "machine learning", "portfolio", "gate exam", "web development")
- NEVER generate generic/vague tags like "personal", "knowledge", "information", "content", "notes", "general", "misc"
- REUSE existing tags when they genuinely match the content's topic
- Return ONLY a JSON array of strings. Example: ["react", "frontend", "css"]
${existingList}`,
        },
        { role: "user", content },
      ],
      max_tokens: 200,
    });
    try {
      const raw = response.choices[0]?.message?.content || "[]";
      const match = raw.match(/\[[\s\S]*?\]/);
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
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a knowledge assistant. Answer questions based ONLY on the provided context. If the context doesn't contain relevant information, say so. Be concise and cite specific notes when possible.\n\nContext:\n${context}`,
        },
        { role: "user", content: question },
      ],
      max_tokens: 500,
    });
    return response.choices[0]?.message?.content || "Unable to answer.";
  }

  async extractFromImage(base64: string, prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:image/png;base64,${base64}` },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });
    return response.choices[0]?.message?.content || "";
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  }
}
