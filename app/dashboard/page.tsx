"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  LayoutGrid,
  List,
  SortAsc,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SearchBar } from "@/components/knowledge/search-bar";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { AiChat } from "@/components/knowledge/ai-chat";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import type { KnowledgeItem } from "@/types";
import { KnowledgeType } from "@/types";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = React.useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalPages, setTotalPages] = React.useState(1);
  const [tags, setTags] = React.useState<{ name: string; count: number }[]>([]);
  const [counts, setCounts] = React.useState({ all: 0, notes: 0, links: 0, insights: 0 });
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [chatOpen, setChatOpen] = React.useState(
    searchParams.get("ai") === "open"
  );

  const search = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const updateParams = React.useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Fetch items
  React.useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (typeFilter && typeFilter !== "all") {
          const typeMap: Record<string, string> = {
            notes: KnowledgeType.NOTE,
            links: KnowledgeType.LINK,
            insights: KnowledgeType.INSIGHT,
          };
          if (typeMap[typeFilter]) params.set("type", typeMap[typeFilter]);
          if (typeFilter.startsWith("tag:")) params.set("tags", typeFilter.slice(4));
        }
        params.set("sort", sortBy);
        params.set("order", sortOrder);
        params.set("page", String(page));
        params.set("limit", "12");

        const res = await fetch(`/api/knowledge?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [search, typeFilter, sortBy, sortOrder, page]);

  // Fetch tags and total counts (independent of filters)
  React.useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [tagsRes, allRes, notesRes, linksRes, insightsRes] = await Promise.all([
          fetch("/api/tags"),
          fetch("/api/knowledge?limit=0"),
          fetch(`/api/knowledge?limit=0&type=${KnowledgeType.NOTE}`),
          fetch(`/api/knowledge?limit=0&type=${KnowledgeType.LINK}`),
          fetch(`/api/knowledge?limit=0&type=${KnowledgeType.INSIGHT}`),
        ]);
        if (tagsRes.ok) {
          const data = await tagsRes.json();
          setTags(data.tags || []);
        }
        const [allData, notesData, linksData, insightsData] = await Promise.all([
          allRes.ok ? allRes.json() : { total: 0 },
          notesRes.ok ? notesRes.json() : { total: 0 },
          linksRes.ok ? linksRes.json() : { total: 0 },
          insightsRes.ok ? insightsRes.json() : { total: 0 },
        ]);
        setCounts({
          all: allData.total || 0,
          notes: notesData.total || 0,
          links: linksData.total || 0,
          insights: insightsData.total || 0,
        });
      } catch {
        // silently handle
      }
    };
    fetchMeta();
  }, [items]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <Sidebar
        counts={counts}
        tags={tags}
        activeFilter={typeFilter}
        onFilterChange={(filter) => updateParams({ type: filter, page: "1" })}
        onNewItem={() => router.push("/capture")}
        className="hidden md:block"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          {/* Top bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar
              value={search}
              onChange={(v) => updateParams({ search: v, page: "1" })}
              className="max-w-sm"
            />
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] p-0.5">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                    view === "grid"
                      ? "bg-[#333333] text-[#ececec]"
                      : "text-[#6b6b6b] hover:text-[#ececec]"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                    view === "list"
                      ? "bg-[#333333] text-[#ececec]"
                      : "text-[#6b6b6b] hover:text-[#ececec]"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sb, so] = e.target.value.split("-");
                    updateParams({ sortBy: sb, sortOrder: so });
                  }}
                  className="h-9 cursor-pointer appearance-none rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] pl-8 pr-3 text-sm text-[#ececec] focus:border-[rgba(255,255,255,0.2)] focus:outline-none"
                >
                  <option value="createdAt-desc">Newest</option>
                  <option value="createdAt-asc">Oldest</option>
                  <option value="updatedAt-desc">Recently Updated</option>
                  <option value="title-asc">Title A–Z</option>
                  <option value="title-desc">Title Z–A</option>
                </select>
                <SortAsc className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b6b6b]" />
              </div>

              {/* New Item */}
              <Button onClick={() => router.push("/capture")} size="sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Item</span>
              </Button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div
              className={
                view === "grid"
                  ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No knowledge items yet"
              description="Start capturing your knowledge by creating your first item."
              actionLabel="Create Item"
              onAction={() => router.push("/capture")}
            />
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {items.map((item) => (
                <KnowledgeCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateParams({ page: String(page - 1) })}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm text-[#8a8a8a]">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateParams({ page: String(page + 1) })}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Toggle */}
      <button
        type="button"
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#c4a47c] text-[#1a1a1a] transition-all hover:bg-[#d4b48c] hover:scale-105 cursor-pointer"
      >
        {chatOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </button>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-30 w-96"
          >
            <AiChat />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full px-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
