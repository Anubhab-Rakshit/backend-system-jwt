import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get("session_token")?.value

  // Define protected routes that require authentication
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

  // If trying to access protected routes without a token, redirect to sign-in
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}

