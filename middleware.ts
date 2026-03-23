import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth routes, login, and verify-email pages
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname === "/verify-email"
  ) {
    return NextResponse.next();
  }

  // Check for session cookie (better-auth uses "better-auth.session_token")
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api/generate", "/api/history", "/profile", "/history", "/verify-email"],
};
