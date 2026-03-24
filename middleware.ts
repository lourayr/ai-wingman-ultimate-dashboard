import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-dev-secret-change-in-production"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /ops routes (but not /ops/login)
  if (pathname.startsWith("/ops") && !pathname.startsWith("/ops/login")) {
    const token = request.cookies.get("ops-session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/ops/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/ops/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ops/:path*"],
};
