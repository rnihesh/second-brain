import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function stripMarkdown(str: string) {
  return str
    .replace(/#{1,6}\s+/g, "")          // headings
    .replace(/\*\*(.+?)\*\*/g, "$1")    // bold
    .replace(/\*(.+?)\*/g, "$1")        // italic
    .replace(/__(.+?)__/g, "$1")        // bold alt
    .replace(/_(.+?)_/g, "$1")          // italic alt
    .replace(/~~(.+?)~~/g, "$1")        // strikethrough
    .replace(/`{3}[\s\S]*?`{3}/g, "")   // code blocks
    .replace(/`(.+?)`/g, "$1")          // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // images
    .replace(/^>\s+/gm, "")             // blockquotes
    .replace(/^-{3,}/gm, "")            // horizontal rules
    .replace(/^\s*[-*+]\s+/gm, "")      // unordered lists
    .replace(/^\s*\d+\.\s+/gm, "")      // ordered lists
    .replace(/\n{2,}/g, " ")            // collapse newlines
    .trim();
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
