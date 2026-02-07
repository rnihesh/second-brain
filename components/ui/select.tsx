"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-normal text-[#8a8a8a]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] px-3 py-2 pr-10 text-sm text-[#ececec] transition-colors duration-150 ease-out",
              "focus:border-[rgba(255,255,255,0.2)] focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-[#c47c7c] focus:border-[#c47c7c]",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-4 w-4 text-[#6b6b6b]" />
          </div>
        </div>
        {error && <p className="text-xs text-[#c47c7c]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
