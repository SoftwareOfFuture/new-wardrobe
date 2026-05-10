import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Read once at cold-start — safe in Edge Runtime
const ADMIN_PATH =
  process.env.NEXT_PUBLIC_ADMIN_PATH ?? "nfjmmn9wxzdf";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only act on admin routes
  if (!pathname.startsWith(`/${ADMIN_PATH}`)) {
    return NextResponse.next();
  }

  // Login page is always public
  if (pathname === `/${ADMIN_PATH}/login`) {
    return NextResponse.next();
  }

  const hasSessionToken =
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.has("authjs.session-token");

  if (!hasSessionToken) {
    return NextResponse.redirect(
      new URL(`/${ADMIN_PATH}/login`, request.url)
    );
  }

  return NextResponse.next();
}

// Broad matcher — no path-specific strings that need updating
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
