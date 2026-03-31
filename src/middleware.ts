import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
  "/api/auth",
  "/api/forgot-password",
  "/api/verify-otp",
  "/api/reset-password",
];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const isPublicPath = PUBLIC_PATHS.some((p) =>
    nextUrl.pathname.startsWith(p)
  );

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect unauthenticated users to login
  if (!token && !isPublicPath) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (token && isPublicPath && !nextUrl.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};