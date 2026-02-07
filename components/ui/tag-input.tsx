"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  label?: string;
  className?: string;
}

function TagInput({
  tags,
  onChange,
  suggestions = [],
  placeholder = "Add a tag...",
  label,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filteredSuggestions = React.useMemo(
    () =>
      suggestions.filter(
        (s) =>
          s.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(s) &&
          inputValue.length > 0
      ),
    [suggestions, inputValue, tags]
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        addTag(filteredSuggestions[highlightedIndex]);
      } else if (inputValue) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-normal text-[#8a8a8a]">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex flex-wrap items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] px-3 py-2 transition-colors duration-150",
          "focus-within:border-[rgba(255,255,255,0.2)]"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <Badge key={tag} variant="default" size="sm" onRemove={() => removeTag(tag)}>
            {tag}
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[80px] flex-1 bg-transparent text-sm text-[#ececec] placeholder:text-[#6b6b6b] outline-none"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="relative">
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className={cn(
                  "w-full px-3 py-1.5 text-left text-sm text-[#8a8a8a] hover:bg-[#333333] hover:text-[#ececec] transition-colors duration-150 cursor-pointer",
                  index === highlightedIndex && "bg-[#333333] text-[#ececec]"
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { TagInput };
