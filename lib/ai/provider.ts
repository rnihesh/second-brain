export interface AIProvider {
  summarize(content: string): Promise<string>;
  autoTag(content: string, existingTags: string[]): Promise<string[]>;
  query(question: string, context: string): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
  extractFromImage(base64: string, prompt: string): Promise<string>;
}

export type ProviderName = "openai" | "gemini" | "ollama";

async function getProvider(): Promise<AIProvider> {
  // Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    const { OpenAIProvider } = await import("./openai");
    return new OpenAIProvider();
  }
  // Try Gemini
  if (process.env.GEMINI_API_KEY) {
    const { GeminiProvider } = await import("./gemini");
    return new GeminiProvider();
  }
  // Fall back to Ollama
  const { OllamaProvider } = await import("./ollama");
  return new OllamaProvider();
}

let cachedProvider: AIProvider | null = null;

export async function getAI(): Promise<AIProvider> {
  if (!cachedProvider) {
    cachedProvider = await getProvider();
  }
  return cachedProvider;
}

export function resetProvider() {
  cachedProvider = null;
}
