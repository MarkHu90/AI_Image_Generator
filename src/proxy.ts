import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const dashboardPaths = ["/generate", "/history", "/settings"];
const authPaths = ["/login", "/register"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Protect dashboard routes
  if (dashboardPaths.some((p) => pathname.startsWith(p)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.some((p) => pathname.startsWith(p)) && session) {
    return NextResponse.redirect(new URL("/generate", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
