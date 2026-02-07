"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  PenLine,
  GitFork,
  FileText,
  Sparkles,
  Search,
  FileText as NoteIcon,
  Link2,
  Lightbulb,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "NOTE" | "LINK" | "INSIGHT";
}

const typeIcons: Record<string, React.ElementType> = {
  NOTE: NoteIcon,
  LINK: Link2,
  INSIGHT: Lightbulb,
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus input when palette opens
  React.useEffect(() => {
    if (open) {
      // Small delay to ensure the DOM is ready after animation
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Listen for Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/knowledge?search=${encodeURIComponent(search)}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.items || []);
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const runAction = (callback: () => void) => {
    setOpen(false);
    setSearch("");
    callback();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
          >
            <Command
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] overflow-hidden"
              shouldFilter={false}
            >
              {/* Input */}
              <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] px-4">
                <Search className="h-4 w-4 shrink-0 text-[#8a8a8a]" />
                <Command.Input
                  ref={inputRef}
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search knowledge, navigate, or ask AI..."
                  className="h-12 w-full bg-transparent text-sm text-[#ececec] placeholder:text-[#6b6b6b] outline-none"
                />
                <kbd className="shrink-0 rounded bg-[#333333] px-1.5 py-0.5 text-[10px] text-[#6b6b6b]">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="px-4 py-8 text-center text-sm text-[#6b6b6b]">
                  {loading ? "Searching..." : "No results found."}
                </Command.Empty>

                {/* Search results */}
                {results.length > 0 && (
                  <Command.Group
                    heading="Knowledge"
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#6b6b6b]"
                  >
                    {results.map((item) => {
                      const TypeIcon = typeIcons[item.type] || NoteIcon;
                      return (
                        <Command.Item
                          key={item.id}
                          value={item.title}
                          onSelect={() =>
                            runAction(() => router.push(`/item/${item.id}`))
                          }
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#ececec] transition-colors data-[selected=true]:bg-[#333333]"
                        >
                          <TypeIcon className="h-4 w-4 shrink-0 text-[#c4a47c]" />
                          <span className="truncate">{item.title}</span>
                          <span className="ml-auto text-xs text-[#6b6b6b]">
                            {item.type.charAt(0) + item.type.slice(1).toLowerCase()}
                          </span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                )}

                {/* Navigation */}
                {!search && (
                  <>
                    <Command.Group
                      heading="Navigation"
                      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#6b6b6b]"
                    >
                      <Command.Item
                        onSelect={() =>
                          runAction(() => router.push("/dashboard"))
                        }
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#ececec] transition-colors data-[selected=true]:bg-[#333333]"
                      >
                        <LayoutDashboard className="h-4 w-4 text-[#8a8a8a]" />
                        Dashboard
                      </Command.Item>
                      <Command.Item
                        onSelect={() =>
                          runAction(() => router.push("/capture"))
                        }
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#ececec] transition-colors data-[selected=true]:bg-[#333333]"
                      >
                        <PenLine className="h-4 w-4 text-[#8a8a8a]" />
                        Capture
                      </Command.Item>
                      <Command.Item
                        onSelect={() =>
                          runAction(() => router.push("/graph"))
                        }
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#ececec] transition-colors data-[selected=true]:bg-[#333333]"
                      >
                        <GitFork className="h-4 w-4 text-[#8a8a8a]" />
                        Graph
                      </Command.Item>
                      <Command.Item
                        onSelect={() =>
                          runAction(() => router.push("/docs"))
                        }
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#ececec] transition-colors data-[selected=true]:bg-[#333333]"
                      >
                        <FileText className="h-4 w-4 text-[#8a8a8a]" />
                        Docs
                      </Command.Item>
                    </Command.Group>

                    <Command.Group
                      heading="Actions"
                      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#6b6b6b]"
                    >
                      <Command.Item
                        onSelect={() =>
                          runAction(() => router.push("/dashboard?ai=open"))
                        }
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#ececec] transition-colors data-[selected=true]:bg-[#333333]"
                      >
                        <Sparkles className="h-4 w-4 text-[#c4a47c]" />
                        Ask AI
                      </Command.Item>
                    </Command.Group>
                  </>
                )}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
