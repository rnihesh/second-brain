import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-xl bg-[#2a2a2a] p-4">
          <Icon className="h-8 w-8 text-[#8a8a8a]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#ececec]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-[#8a8a8a]">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
