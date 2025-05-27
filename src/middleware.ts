// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/", "/login", "/register", "/api/auth"];

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

// Importante definir um matcher:
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
