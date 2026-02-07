"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { CommandPalette } from "@/components/command-palette";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CommandPalette />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#2a2a2a",
            color: "#ececec",
            border: "1px solid rgba(255,255,255,0.06)",
          },
        }}
      />
    </SessionProvider>
  );
}
