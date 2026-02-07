import Link from "next/link";
import { Brain } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-center">
        <Brain className="w-16 h-16 text-[#c4a47c]/50 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-[#ececec] mb-2">404</h1>
        <p className="text-[#8a8a8a] mb-8">This page doesn&apos;t exist in your Second Brain.</p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-[#c4a47c] text-[#1a1a1a] font-medium hover:bg-[#d4b48c] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
