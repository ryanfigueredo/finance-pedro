// src/middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/api/auth", "/"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isPublic = publicRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|api/public|login).*)"],
};
