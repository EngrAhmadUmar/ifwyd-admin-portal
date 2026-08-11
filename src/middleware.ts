import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROLES = new Set(["admin"]);

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login")) return NextResponse.next();

  const token =
    request.cookies.get("ifwyd_admin_token")?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = parseJwtPayload(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = typeof payload.role === "string" ? payload.role : "";
  if (!ADMIN_ROLES.has(role)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|Asset).*)"],
};
