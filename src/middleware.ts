import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/nfjmmn9wxzdf/login") {
    return NextResponse.next();
  }

  const hasSessionToken =
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.has("authjs.session-token");

  if (!hasSessionToken) {
    return NextResponse.redirect(new URL("/nfjmmn9wxzdf/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/nfjmmn9wxzdf/:path*"],
};
