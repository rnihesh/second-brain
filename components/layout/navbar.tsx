"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  PenLine,
  GitFork,
  FileText,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/capture", label: "Capture", icon: PenLine },
  { href: "/graph", label: "Graph", icon: GitFork },
  { href: "/docs", label: "Docs", icon: FileText },
];

function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const openCommandPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true })
    );
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.06)] bg-[#1a1a1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[#ececec] transition-colors hover:text-[#c4a47c]"
        >
          <Brain className="h-6 w-6 text-[#c4a47c]" />
          <span className="text-lg font-bold">Second Brain</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#c4a47c]/10 text-[#c4a47c]"
                    : "text-[#8a8a8a] hover:bg-[#2a2a2a] hover:text-[#ececec]"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            type="button"
            onClick={openCommandPalette}
            className="hidden items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] px-3 py-1.5 text-sm text-[#8a8a8a] transition-colors hover:border-[rgba(255,255,255,0.12)] hover:text-[#ececec] sm:flex cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-2 rounded bg-[#333333] px-1.5 py-0.5 text-xs text-[#6b6b6b]">
              ⌘K
            </kbd>
          </button>

          {/* User menu (logged in) */}
          {session?.user ? (
            <div ref={userMenuRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#ececec] transition-colors hover:bg-[#2a2a2a] cursor-pointer"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c4a47c]/20 text-[#c4a47c]">
                  <User className="h-4 w-4" />
                </div>
                <span className="max-w-[120px] truncate">
                  {session.user.name || session.user.email}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] py-1"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#ececec] hover:bg-[#333333] transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#ececec] hover:bg-[#333333] transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Auth buttons (logged out) */
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/auth/signin"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#8a8a8a] transition-colors hover:text-[#ececec]"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-[#c4a47c] px-3 py-1.5 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-[#d4b48c]"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-[#8a8a8a] hover:bg-[#2a2a2a] hover:text-[#ececec] md:hidden cursor-pointer"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[rgba(255,255,255,0.06)] md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#c4a47c]/10 text-[#c4a47c]"
                        : "text-[#8a8a8a] hover:bg-[#2a2a2a] hover:text-[#ececec]"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="my-2 border-t border-[rgba(255,255,255,0.06)]" />
              {session?.user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#8a8a8a] hover:bg-[#2a2a2a] hover:text-[#ececec] transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#8a8a8a] hover:bg-[#2a2a2a] hover:text-[#ececec] transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#8a8a8a] hover:bg-[#2a2a2a] hover:text-[#ececec] transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#c4a47c] hover:bg-[#2a2a2a] transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export { Navbar };
