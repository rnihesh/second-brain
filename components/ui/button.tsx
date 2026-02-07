"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variantStyles = {
  default:
    "bg-surface text-foreground hover:bg-surface-hover active:bg-surface border border-border",
  primary:
    "bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/80",
  accent:
    "bg-accent text-background hover:bg-accent-hover active:bg-accent",
  outline:
    "bg-transparent text-foreground border border-border-hover hover:bg-surface hover:border-border-hover",
  ghost:
    "text-muted hover:bg-surface hover:text-foreground active:bg-surface-hover",
  destructive:
    "bg-[#c47c7c]/10 text-[#c47c7c] hover:bg-[#c47c7c]/20 active:bg-[#c47c7c]/15",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2.5",
  icon: "h-10 w-10 rounded-lg flex items-center justify-center p-0",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading = false,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        className: cn(
          "inline-flex items-center justify-center font-normal transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)]",
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && "pointer-events-none opacity-50",
          className
        ),
        ref,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-normal transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)] cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && "pointer-events-none opacity-50",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
