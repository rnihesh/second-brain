"use client";

import React from "react";
import { FadeIn } from "@/components/animations/fade-in";
import { KnowledgeForm } from "@/components/knowledge/knowledge-form";
import { Brain, Sparkles } from "lucide-react";

export default function CapturePage() {
  const [availableTags, setAvailableTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const data = await res.json();
          setAvailableTags(
            (data.tags || []).map((t: { name: string }) => t.name)
          );
        }
      } catch {
        // silently handle
      }
    };
    fetchTags();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <FadeIn>
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-[#c4a47c]/10 p-2.5">
              <Brain className="h-6 w-6 text-[#c4a47c]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#ececec]">
                Capture Knowledge
              </h1>
              <p className="text-sm text-[#8a8a8a]">
                Add a note, save a link, or record an insight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] px-4 py-3 text-sm text-[#8a8a8a]">
            <Sparkles className="h-4 w-4 text-[#c4a47c]" />
            Enable auto-summarize and auto-tag for AI-powered enrichment
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] p-6 sm:p-8">
          <KnowledgeForm availableTags={availableTags} />
        </div>
      </FadeIn>
    </div>
  );
}
