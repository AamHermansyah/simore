import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { authRoutes, publicRoutes } from "./lib/routes";
import { JWT_SECRET } from "./lib/auth";

const SECRET = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const token = request.cookies.get("token")?.value;
  const isLoggedIn = !!token;

  const isAuthRoute = authRoutes.includes(url.pathname);
  const isPublicRoute = publicRoutes.some((path) => path === url.pathname);

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = url.pathname;
    if (url.search) {
      callbackUrl += url.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, request.url)
    );
  }

  try {
    const { payload } = await jwtVerify(token!, SECRET);

    const role = payload.role as string | undefined;

    if (role) {
      const res = NextResponse.next();
      res.cookies.set("role", role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res;
    }
  } catch (err) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("token");
    res.cookies.delete("role");
    return res;
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};