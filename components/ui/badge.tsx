"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const variantStyles = {
  default: "bg-border text-muted",
  secondary: "bg-border text-muted",
  outline: "bg-transparent text-muted border border-border",
  accent: "bg-accent/10 text-accent",
  "type-note": "bg-accent/10 text-accent",
  "type-link": "bg-border text-muted",
  "type-insight": "bg-accent/10 text-accent",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  onRemove?: () => void;
}

function Badge({
  className,
  variant = "default",
  size = "sm",
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-normal transition-colors duration-150",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-border-hover transition-colors duration-150 cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

export { Badge };
