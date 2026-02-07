"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variantStyles = {
  default:
    "bg-[#2a2a2a] text-[#ececec] hover:bg-[#333333] active:bg-[#2a2a2a] border border-[rgba(255,255,255,0.06)]",
  primary:
    "bg-[#ececec] text-[#1a1a1a] hover:bg-[#d4d4d4] active:bg-[#c0c0c0]",
  accent:
    "bg-[#c4a47c] text-[#1a1a1a] hover:bg-[#d4b48c] active:bg-[#b4946c]",
  outline:
    "bg-transparent text-[#ececec] border border-[rgba(255,255,255,0.12)] hover:bg-[#2a2a2a] hover:border-[rgba(255,255,255,0.2)]",
  ghost:
    "text-[#8a8a8a] hover:bg-[#2a2a2a] hover:text-[#ececec] active:bg-[#333333]",
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
          "inline-flex items-center justify-center font-normal transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.25)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]",
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
          "inline-flex items-center justify-center font-normal transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.25)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] cursor-pointer",
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
