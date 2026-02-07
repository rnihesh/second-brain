"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Calendar, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!session?.user) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <FadeIn>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <h1 className="mb-8 text-2xl font-bold text-foreground">Profile</h1>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-accent" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {session.user.name || "User"}
              </h2>
              <p className="text-sm text-muted">Account details</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            {session.user.name && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                <User className="h-4 w-4 text-muted" />
                <div>
                  <p className="text-xs text-dim">Name</p>
                  <p className="text-sm text-foreground">{session.user.name}</p>
                </div>
              </div>
            )}

            {session.user.email && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                <Mail className="h-4 w-4 text-muted" />
                <div>
                  <p className="text-xs text-dim">Email</p>
                  <p className="text-sm text-foreground">{session.user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
              <Calendar className="h-4 w-4 text-muted" />
              <div>
                <p className="text-xs text-dim">Session</p>
                <p className="text-sm text-foreground">Active</p>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <div className="mt-8 border-t border-border pt-6">
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
