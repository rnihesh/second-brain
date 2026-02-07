"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Link2,
  Lightbulb,
  Sparkles,
  Tags,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Paperclip,
  Download,
  Image as ImageIcon,
  FileText as FileIcon,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { KnowledgeForm } from "@/components/knowledge/knowledge-form";
import type { KnowledgeItem } from "@/types";
import { KnowledgeType } from "@/types";

const typeConfig = {
  [KnowledgeType.NOTE]: {
    icon: FileText,
    label: "Note",
    variant: "type-note" as const,
  },
  [KnowledgeType.LINK]: {
    icon: Link2,
    label: "Link",
    variant: "type-link" as const,
  },
  [KnowledgeType.INSIGHT]: {
    icon: Lightbulb,
    label: "Insight",
    variant: "type-insight" as const,
  },
};

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = React.useState<KnowledgeItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [summaryOpen, setSummaryOpen] = React.useState(true);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [summarizing, setSummarizing] = React.useState(false);
  const [autoTagging, setAutoTagging] = React.useState(false);
  const [availableTags, setAvailableTags] = React.useState<string[]>([]);

  // Fetch item
  React.useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/knowledge/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data);
        } else {
          toast.error("Item not found");
          router.push("/dashboard");
        }
      } catch {
        toast.error("Failed to load item");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, router]);

  // Fetch tags
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

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Item deleted");
        router.push("/dashboard");
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await fetch(`/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ knowledgeItemId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setItem((prev) => (prev ? { ...prev, summary: data.summary } : prev));
        toast.success("Summary generated!");
      } else {
        toast.error("Failed to summarize");
      }
    } catch {
      toast.error("Failed to summarize");
    } finally {
      setSummarizing(false);
    }
  };

  const handleAutoTag = async () => {
    setAutoTagging(true);
    try {
      const res = await fetch(`/api/ai/auto-tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ knowledgeItemId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setItem((prev) => (prev ? { ...prev, tags: data.tags } : prev));
        toast.success("Tags generated!");
      } else {
        toast.error("Failed to auto-tag");
      }
    } catch {
      toast.error("Failed to auto-tag");
    } finally {
      setAutoTagging(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Skeleton className="mb-4 h-8 w-32" />
        <Skeleton className="mb-2 h-10 w-3/4" />
        <Skeleton className="mb-6 h-6 w-48" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!item) return null;

  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Back button */}
      <FadeIn>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </FadeIn>

      <FadeIn delay={0.05}>
        <article className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <Badge variant={config.variant} size="md">
                  <Icon className="mr-1 h-3.5 w-3.5" />
                  {config.label}
                </Badge>
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-accent transition-colors hover:text-accent-hover"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Source
                  </a>
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {item.title}
              </h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-dim">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSummarize}
                loading={summarizing}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Summarize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoTag}
                loading={autoTagging}
              >
                <Tags className="h-3.5 w-3.5" />
                Auto-tag
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteConfirm(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" size="md">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* AI Summary */}
          {item.summary && (
            <div className="mb-6 rounded-lg border border-accent/20 bg-accent/5 p-4">
              <button
                type="button"
                onClick={() => setSummaryOpen(!summaryOpen)}
                className="flex w-full items-center justify-between text-sm font-medium text-accent cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </span>
                {summaryOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              <AnimatePresence>
                {summaryOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-sm leading-relaxed text-foreground">
                      {item.summary}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* File Attachment */}
          {item.fileName && (
            <div className="mb-6 rounded-lg border border-border bg-background overflow-hidden">
              {/* Image preview */}
              {item.fileType?.startsWith("image/") ? (
                <div className="relative">
                  <img
                    src={item.fileName}
                    alt={item.title}
                    className="w-full max-h-96 object-contain bg-background"
                  />
                  <a
                    href={item.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-surface/90 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-hover"
                  >
                    <Download className="h-3 w-3" />
                    Open
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      {item.fileType === "application/pdf" ? (
                        <FileIcon className="h-4 w-4 text-accent" />
                      ) : item.fileType?.startsWith("image/") ? (
                        <ImageIcon className="h-4 w-4 text-accent" />
                      ) : (
                        <Paperclip className="h-4 w-4 text-accent" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.fileName.split("/").pop()}
                      </p>
                      <p className="text-xs text-dim">{item.fileType}</p>
                    </div>
                  </div>
                  <a
                    href={item.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-surface"
                  >
                    <Download className="h-3 w-3" />
                    Open
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-headings:mt-8 prose-headings:mb-4 prose-p:text-foreground prose-a:text-accent prose-a:underline prose-strong:text-foreground prose-code:rounded prose-code:bg-surface-hover prose-code:px-1.5 prose-code:py-0.5 prose-code:text-accent prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border prose-pre:bg-background prose-pre:text-foreground prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-foreground prose-li:my-1 prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted prose-table:border-collapse prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:text-foreground prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 prose-img:rounded-lg prose-hr:border-border">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
          </div>
        </article>
      </FadeIn>

      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Item"
        size="lg"
      >
        <KnowledgeForm initialData={item} availableTags={availableTags} />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title="Delete Item"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to delete &quot;{item.title}&quot;? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
