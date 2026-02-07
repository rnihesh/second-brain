import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider } from "./provider";

export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  private async chat(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
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
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/png",
          data: base64,
        },
      },
    ]);
    return result.response.text();
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }
}
