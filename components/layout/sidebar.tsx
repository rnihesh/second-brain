"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  FileText,
  Link2,
  Lightbulb,
  Tag,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  counts: { all: number; notes: number; links: number; insights: number };
  tags: { name: string; count: number }[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onNewItem?: () => void;
  className?: string;
}

const filters = [
  { key: "all", label: "All Items", icon: Layers },
  { key: "notes", label: "Notes", icon: FileText },
  { key: "links", label: "Links", icon: Link2 },
  { key: "insights", label: "Insights", icon: Lightbulb },
];

function Sidebar({
  counts,
  tags,
  activeFilter,
  onFilterChange,
  onNewItem,
  className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="fixed bottom-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-background md:hidden cursor-pointer"
      >
        <ChevronLeft
          className={cn(
            "h-5 w-5 transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed inset-y-0 left-0 top-16 z-20 w-64 border-r border-border bg-background p-4 md:sticky md:block",
              className
            )}
          >
            {/* New Item button */}
            {onNewItem && (
              <Button
                onClick={onNewItem}
                className="mb-6 w-full"
                size="md"
              >
                <Plus className="h-4 w-4" />
                New Item
              </Button>
            )}

            {/* Filters */}
            <div className="space-y-1">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-dim">
                Filters
              </p>
              {filters.map((filter) => {
                const count = counts[filter.key as keyof typeof counts];
                const isActive = activeFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => onFilterChange(filter.key)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <filter.icon className="h-4 w-4" />
                      {filter.label}
                    </span>
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        isActive ? "text-accent" : "text-dim"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-dim">
                  <Tag className="mb-0.5 mr-1.5 inline h-3 w-3" />
                  Popular Tags
                </p>
                <div className="flex flex-wrap gap-1.5 px-3">
                  {tags.map((tag) => {
                    const isTagActive = activeFilter === `tag:${tag.name}`;
                    return (
                      <Badge
                        key={tag.name}
                        variant={isTagActive ? "accent" : "secondary"}
                        size="sm"
                        className="cursor-pointer hover:bg-surface-hover transition-colors"
                        onClick={() =>
                          onFilterChange(isTagActive ? "all" : `tag:${tag.name}`)
                        }
                      >
                        {tag.name}
                        <span className="ml-1 text-dim">{tag.count}</span>
                        {isTagActive && (
                          <span className="ml-1 text-accent">&times;</span>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop on mobile */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 bg-black/40 md:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export { Sidebar };
