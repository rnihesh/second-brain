import Link from "next/link";
import { Brain } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Brain className="w-16 h-16 text-accent/50 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted mb-8">This page doesn&apos;t exist in your Second Brain.</p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-accent text-background font-medium hover:bg-accent-hover transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
