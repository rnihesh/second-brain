"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate, truncate, stripMarkdown } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileText, Link2, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { KnowledgeItem } from "@/types";
import { KnowledgeType } from "@/types";

interface KnowledgeCardProps {
  item: KnowledgeItem;
  className?: string;
}

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

function KnowledgeCard({ item, className }: KnowledgeCardProps) {
  const config = typeConfig[item.type];
  const Icon = config.icon;
  const displayText = item.summary || item.content;

  return (
    <Link href={`/item/${item.id}`}>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "group rounded-xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-border-hover",
          className
        )}
      >
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <Badge variant={config.variant} size="sm">
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
          {item.title}
        </h3>

        {/* Content preview */}
        <p className="mb-3 text-sm leading-relaxed text-muted line-clamp-3">
          {truncate(stripMarkdown(displayText), 180)}
        </p>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <Badge key={tag.id} variant="secondary" size="sm">
                {tag.name}
              </Badge>
            ))}
            {item.tags.length > 4 && (
              <span className="text-xs text-dim">
                +{item.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <p className="text-xs text-dim">
          {formatDate(item.createdAt)}
        </p>
      </motion.article>
    </Link>
  );
}

export { KnowledgeCard };
