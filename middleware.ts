import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get("admin-auth")?.value === "true";

  // If trying to access admin login page
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      // If authenticated and on login page, redirect to admin dashboard
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // If not authenticated, allow access to login page
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      // Preserve the original destination to redirect back after login if desired
      // For now, just redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
}; 