"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-normal text-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon className="h-4 w-4 text-dim" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-dim transition-colors duration-150 ease-out",
              "focus:border-border-hover focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              Icon && "pl-10",
              error && "border-[#c47c7c] focus:border-[#c47c7c]",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[#c47c7c]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
