"use client";

import { useState } from "react";
import { Search, Brain, ExternalLink, Loader2 } from "lucide-react";

interface Source {
  id: string;
  title: string;
  excerpt: string;
}

export default function EmbedPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/public/brain/query?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setAnswer(data.answer || "No answer found.");
      setSources(data.sources || []);
    } catch {
      setAnswer("An error occurred while searching.");
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#ececec] p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-[#c4a47c]" />
          <h1 className="text-lg font-semibold">Second Brain</h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)] rounded-lg text-sm text-[#ececec] placeholder:text-[#6b6b6b] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
          />
        </form>

        {/* Results */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-[#c4a47c] animate-spin" />
            <span className="ml-2 text-sm text-[#8a8a8a]">Searching...</span>
          </div>
        )}

        {!loading && searched && (
          <div className="space-y-4">
            <div className="p-4 bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)] rounded-lg">
              <p className="text-sm text-[#ececec] leading-relaxed">{answer}</p>
            </div>

            {sources.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-2">
                  Sources
                </h3>
                <div className="space-y-2">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className="p-3 bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)] rounded-lg"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <ExternalLink className="w-3 h-3 text-[#c4a47c]" />
                        <span className="text-sm font-medium text-[#ececec]">{source.title}</span>
                      </div>
                      <p className="text-xs text-[#8a8a8a]">{source.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !searched && (
          <p className="text-center text-sm text-[#6b6b6b] py-8">
            Ask anything about the knowledge base
          </p>
        )}

        {/* Embed instructions */}
        <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <p className="text-xs text-[#6b6b6b] text-center">
            Powered by Second Brain
          </p>
        </div>
      </div>
    </div>
  );
}
