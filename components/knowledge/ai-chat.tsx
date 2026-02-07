"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, ExternalLink } from "lucide-react";
import type { QueryResponse } from "@/types";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: QueryResponse["sources"];
}

function AiChat({ className }: { className?: string }) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data: QueryResponse = await res.json();
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I couldn't process your question. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={cn(
        "flex h-[600px] flex-col rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a]",
        className
      )}
    >
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Bot className="mb-3 h-10 w-10 text-[#6b6b6b]" />
            <p className="text-sm text-[#8a8a8a]">
              Ask me anything about your knowledge base.
            </p>
            <p className="mt-1 text-xs text-[#6b6b6b]">
              I&apos;ll search your notes, links, and insights to find answers.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "flex gap-3",
                msg.role === "user" && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  msg.role === "user"
                    ? "bg-[#c4a47c]/20 text-[#c4a47c]"
                    : "bg-[#333333] text-[#8a8a8a]"
                )}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Content */}
              <div
                className={cn(
                  "max-w-[80%] rounded-xl px-4 py-2.5",
                  msg.role === "user"
                    ? "bg-[#c4a47c]/10 text-[#ececec]"
                    : "bg-[#333333] text-[#ececec]"
                )}
              >
                <div className="prose prose-sm prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 border-t border-[rgba(255,255,255,0.06)] pt-2">
                    <p className="mb-1.5 text-xs font-medium text-[#8a8a8a]">
                      Sources
                    </p>
                    <div className="space-y-1">
                      {msg.sources.map((source) => (
                        <a
                          key={source.id}
                          href={`/item/${source.id}`}
                          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#c4a47c] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          <span className="truncate">{source.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#333333] text-[#8a8a8a]">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-[#333333] px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-[#c4a47c]" />
              <span className="text-xs text-[#8a8a8a]">Thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[rgba(255,255,255,0.06)] p-4">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            disabled={loading}
            className={cn(
              "flex-1 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#1a1a1a] px-4 py-2.5 text-sm text-[#ececec] placeholder:text-[#6b6b6b] transition-colors",
              "focus:border-[rgba(255,255,255,0.2)] focus:outline-none",
              "disabled:opacity-50"
            )}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg bg-[#c4a47c] text-[#1a1a1a] transition-colors cursor-pointer",
              "hover:bg-[#d4b48c] disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { AiChat };
