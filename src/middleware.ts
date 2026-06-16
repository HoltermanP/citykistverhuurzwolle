import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Loginpagina en login-API zijn altijd toegankelijk.
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (await isValidAdminToken(token)) {
    return NextResponse.next();
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  if (pathname !== "/admin") {
    loginUrl.searchParams.set("redirect", pathname + search);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Bescherm zowel de admin-UI als de admin-API.
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
