"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const variantStyles = {
  default: "bg-[rgba(255,255,255,0.06)] text-[#8a8a8a]",
  secondary: "bg-[rgba(255,255,255,0.06)] text-[#8a8a8a]",
  outline: "bg-transparent text-[#8a8a8a] border border-[rgba(255,255,255,0.06)]",
  accent: "bg-[#c4a47c]/10 text-[#c4a47c]",
  "type-note": "bg-[#c4a47c]/10 text-[#c4a47c]",
  "type-link": "bg-[rgba(255,255,255,0.06)] text-[#8a8a8a]",
  "type-insight": "bg-[#c4a47c]/10 text-[#c4a47c]",
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
          className="ml-0.5 rounded-full p-0.5 hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-150 cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

export { Badge };
