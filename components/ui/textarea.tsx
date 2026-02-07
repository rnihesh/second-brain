"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, maxLength, showCount = false, id, value, defaultValue, onChange, ...props },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [charCount, setCharCount] = React.useState(
      () => String(value ?? defaultValue ?? "").length
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    React.useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value]);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-normal text-[#8a8a8a]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "flex min-h-[120px] w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] px-3 py-2 text-sm text-[#ececec] placeholder:text-[#6b6b6b] transition-colors duration-150 ease-out resize-y",
            "focus:border-[rgba(255,255,255,0.2)] focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#c47c7c] focus:border-[#c47c7c]",
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          {error && <p className="text-xs text-[#c47c7c]">{error}</p>}
          {showCount && maxLength && (
            <p
              className={cn(
                "ml-auto text-xs text-[#6b6b6b]",
                charCount > maxLength * 0.9 && "text-[#c4a47c]",
                charCount >= maxLength && "text-[#c47c7c]"
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
