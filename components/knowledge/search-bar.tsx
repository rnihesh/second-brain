"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search, Command } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onCmdK?: () => void;
  placeholder?: string;
  className?: string;
}

function SearchBar({
  value,
  onChange,
  onCmdK,
  placeholder = "Search knowledge...",
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalValue(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(v), 300);
  };

  React.useEffect(() => {
    if (!onCmdK) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onCmdK();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCmdK]);

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-[#8a8a8a]" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] pl-10 pr-16 text-sm text-[#ececec] placeholder:text-[#6b6b6b] transition-colors duration-200",
          "focus:border-[rgba(255,255,255,0.2)] focus:outline-none"
        )}
      />
      {onCmdK && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <kbd className="flex items-center gap-0.5 rounded bg-[#333333] px-1.5 py-0.5 text-xs text-[#6b6b6b]">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      )}
    </div>
  );
}

export { SearchBar };
