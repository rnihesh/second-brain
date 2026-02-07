import { Brain, Layers, Sparkles, Bot, Globe, ArrowRight, Code, Database, Cpu, Shield } from "lucide-react";

export const metadata = {
  title: "Documentation | Second Brain",
};

function Section({ id, icon: Icon, title, children }: { id: string; icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[#c4a47c]/10 text-[#c4a47c]">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-[#ececec]">{title}</h2>
      </div>
      <div className="space-y-4 text-[#ececec] leading-relaxed">{children}</div>
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 overflow-x-auto text-sm font-mono text-[#ececec]">
      <code>{children}</code>
    </pre>
  );
}

function Principle({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-[#1a1a1a] border border-[rgba(255,255,255,0.06)]">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#c4a47c]/20 text-[#c4a47c] flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-[#ececec] mb-1">{title}</h4>
        <p className="text-[#8a8a8a] text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-[#c4a47c]" />
            <h1 className="text-4xl font-bold text-[#c4a47c]">
              Architecture & Documentation
            </h1>
          </div>
          <p className="text-[#8a8a8a] text-lg max-w-2xl">
            A deep dive into the architectural decisions, design principles, and infrastructure
            that power Second Brain.
          </p>

          {/* Quick nav */}
          <nav className="mt-8 flex flex-wrap gap-2">
            {[
              { href: "#portable-architecture", label: "Portable Architecture" },
              { href: "#ux-principles", label: "UX Principles" },
              { href: "#agent-thinking", label: "Agent Thinking" },
              { href: "#infrastructure", label: "Infrastructure" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-full text-sm bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)] text-[#ececec] hover:text-[#c4a47c] hover:border-[#c4a47c]/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-16">
          {/* 1. Portable Architecture */}
          <Section id="portable-architecture" icon={Layers} title="Portable Architecture">
            <p>
              Second Brain is built with a layered architecture that maintains clear separation of
              concerns. Each layer can be swapped independently without affecting others.
            </p>

            <div className="grid gap-4 mt-6">
              <div className="p-4 rounded-lg bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-[#c4a47c]" />
                  <h4 className="font-semibold text-[#ececec]">Presentation Layer</h4>
                </div>
                <p className="text-sm text-[#8a8a8a]">
                  React components with Next.js App Router. Swappable with any React framework
                  or even a mobile app consuming the same API.
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#6b6b6b] rotate-90" />
              </div>

              <div className="p-4 rounded-lg bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-[#c4a47c]" />
                  <h4 className="font-semibold text-[#ececec]">API Layer</h4>
                </div>
                <p className="text-sm text-[#8a8a8a]">
                  Next.js API routes exposing RESTful endpoints. Can be replaced with Express,
                  FastAPI, or any HTTP framework. Routes are thin — they validate input and
                  delegate to services.
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#6b6b6b] rotate-90" />
              </div>

              <div className="p-4 rounded-lg bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-[#c4a47c]" />
                  <h4 className="font-semibold text-[#ececec]">AI Service Layer</h4>
                </div>
                <p className="text-sm text-[#8a8a8a]">
                  Abstraction layer with provider interface. Supports OpenAI, Gemini, and Ollama
                  with automatic fallback chain. Adding a new provider requires implementing one
                  interface with 4 methods.
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-[#6b6b6b] rotate-90" />
              </div>

              <div className="p-4 rounded-lg bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-[#c4a47c]" />
                  <h4 className="font-semibold text-[#ececec]">Data Layer</h4>
                </div>
                <p className="text-sm text-[#8a8a8a]">
                  Prisma ORM with PostgreSQL. The schema is database-agnostic via Prisma — switching
                  to MySQL, SQLite, or MongoDB requires only a datasource change.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#ececec] mb-3">AI Provider Interface</h3>
              <CodeBlock>{`interface AIProvider {
  summarize(content: string): Promise<string>;
  autoTag(content: string, existingTags: string[]): Promise<string[]>;
  query(question: string, context: string): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
}

// Adding a new provider:
export class AnthropicProvider implements AIProvider {
  // Implement 4 methods — done!
}`}</CodeBlock>
            </div>
          </Section>

          {/* 2. UX Principles */}
          <Section id="ux-principles" icon={Sparkles} title="Principles-Based UX">
            <p>
              Every AI interaction in Second Brain is guided by these five design principles:
            </p>

            <div className="space-y-3 mt-6">
              <Principle
                number={1}
                title="Progressive Disclosure"
                description="AI features are opt-in, not forced. Users choose when to auto-summarize or auto-tag. The interface starts simple and reveals complexity on demand."
              />
              <Principle
                number={2}
                title="Contextual Intelligence"
                description="AI suggestions appear where they're relevant — tag suggestions during capture, summaries in detail views, conversational queries in the dashboard. AI augments the workflow, never interrupts it."
              />
              <Principle
                number={3}
                title="Graceful Degradation"
                description="The app remains fully functional without AI. If all providers are unavailable, users can still capture, organize, and search their knowledge manually. AI enhances but isn't required."
              />
              <Principle
                number={4}
                title="Consistent Feedback"
                description="Every action has visual confirmation — toast notifications for saves, loading spinners for AI processing, skeleton loaders for data fetching. Users always know the system state."
              />
              <Principle
                number={5}
                title="Keyboard-First Power"
                description="Power users can navigate entirely via keyboard. Cmd+K opens the command palette, shortcuts exist for common actions, and focus management follows WAI-ARIA patterns."
              />
            </div>
          </Section>

          {/* 3. Agent Thinking */}
          <Section id="agent-thinking" icon={Bot} title="Agent Thinking">
            <p>
              Second Brain implements autonomous background processes that maintain and improve
              the knowledge base over time:
            </p>

            <div className="grid gap-4 mt-6">
              <div className="p-4 rounded-lg bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)]">
                <h4 className="font-semibold text-[#ececec] mb-2">Auto-Tagging Agent</h4>
                <p className="text-sm text-[#8a8a8a]">
                  When a new knowledge item is created with the auto-tag option enabled, the system
                  analyzes the content and suggests relevant tags. It prefers existing tags to maintain
                  consistency, but creates new ones when the content introduces novel concepts.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)]">
                <h4 className="font-semibold text-[#ececec] mb-2">Summarization Agent</h4>
                <p className="text-sm text-[#8a8a8a]">
                  On-demand summarization generates concise 2-3 sentence summaries of knowledge items.
                  Summaries are stored and can be regenerated if the content is updated, ensuring they
                  stay current.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)]">
                <h4 className="font-semibold text-[#ececec] mb-2">Embedding Agent</h4>
                <p className="text-sm text-[#8a8a8a]">
                  Vector embeddings are generated for each knowledge item, enabling semantic search.
                  When content is updated, embeddings are regenerated to maintain search accuracy.
                  The embedding model is configurable per provider.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)]">
                <h4 className="font-semibold text-[#ececec] mb-2">Query Agent</h4>
                <p className="text-sm text-[#8a8a8a]">
                  The conversational query system acts as an intelligent retrieval agent. It receives
                  a question, searches the knowledge base for relevant context, and synthesizes an
                  answer citing specific sources. It's available both through the UI and the public API.
                </p>
              </div>
            </div>
          </Section>

          {/* 4. Infrastructure Mindset */}
          <Section id="infrastructure" icon={Shield} title="Infrastructure Mindset">
            <p>
              Second Brain exposes its intelligence through a public API and embeddable widget,
              enabling external systems to access your knowledge base.
            </p>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#ececec] mb-3">Public API</h3>
              <p className="text-sm text-[#8a8a8a] mb-3">
                Query your knowledge base programmatically:
              </p>
              <CodeBlock>{`# Query the knowledge base
curl "https://your-app.vercel.app/api/public/brain/query?q=What%20do%20I%20know%20about%20React%20hooks"

# Response
{
  "answer": "Based on your notes, React hooks allow...",
  "sources": [
    {
      "id": "clx123",
      "title": "React Hooks Deep Dive",
      "excerpt": "useEffect manages side effects..."
    }
  ],
  "timestamp": "2026-02-07T12:00:00Z"
}`}</CodeBlock>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#ececec] mb-3">Embeddable Widget</h3>
              <p className="text-sm text-[#8a8a8a] mb-3">
                Embed a search widget on any website:
              </p>
              <CodeBlock>{`<!-- Add to any HTML page -->
<iframe
  src="https://your-app.vercel.app/embed"
  width="400"
  height="500"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);"
></iframe>`}</CodeBlock>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#ececec] mb-3">Knowledge API Endpoints</h3>
              <div className="space-y-2">
                {[
                  { method: "GET", path: "/api/knowledge", desc: "List items (auth required)" },
                  { method: "POST", path: "/api/knowledge", desc: "Create item (auth required)" },
                  { method: "GET", path: "/api/knowledge/:id", desc: "Get item (auth required)" },
                  { method: "PUT", path: "/api/knowledge/:id", desc: "Update item (auth required)" },
                  { method: "DELETE", path: "/api/knowledge/:id", desc: "Delete item (auth required)" },
                  { method: "POST", path: "/api/ai/summarize", desc: "Summarize content (auth required)" },
                  { method: "POST", path: "/api/ai/auto-tag", desc: "Auto-tag content (auth required)" },
                  { method: "POST", path: "/api/ai/query", desc: "Query knowledge base (auth required)" },
                  { method: "GET", path: "/api/public/brain/query", desc: "Public query (no auth)" },
                  { method: "GET", path: "/api/tags", desc: "List all tags" },
                  { method: "POST", path: "/api/upload", desc: "Upload file (auth required)" },
                ].map((endpoint) => (
                  <div
                    key={endpoint.path + endpoint.method}
                    className="flex items-center gap-3 p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.06)] text-sm"
                  >
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        endpoint.method === "GET"
                          ? "bg-[#c4a47c]/20 text-[#c4a47c]"
                          : endpoint.method === "POST"
                          ? "bg-[rgba(255,255,255,0.06)] text-[#ececec]"
                          : endpoint.method === "PUT"
                          ? "bg-[#c4a47c]/10 text-[#d4b48c]"
                          : "bg-[#c47c7c]/20 text-[#c47c7c]"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-[#ececec] font-mono">{endpoint.path}</code>
                    <span className="text-[#6b6b6b] ml-auto">{endpoint.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-[rgba(255,255,255,0.06)] text-center text-[#6b6b6b] text-sm">
          <p>Second Brain — Built with Next.js, Prisma, and AI</p>
        </div>
      </div>
    </div>
  );
}
