import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/capture", "/graph", "/item", "/profile"];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/auth/signin", "/auth/signup"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for NextAuth session token cookie
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = !!token;

  // Logged-in users visiting auth pages or landing → redirect to dashboard
  if (isLoggedIn) {
    if (authRoutes.some((r) => pathname.startsWith(r)) || pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Logged-out users visiting protected routes → redirect to signin
  if (!isLoggedIn) {
    if (protectedRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/capture/:path*",
    "/graph/:path*",
    "/item/:path*",
    "/profile/:path*",
    "/auth/signin",
    "/auth/signup",
  ],
};
