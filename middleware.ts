import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const allCookies = await cookies();
  const token = allCookies.get("firebaseIdToken")?.value;

  if (!token) {
    if (pathname !== "/auth") {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
    return NextResponse.next();
  }

  try {
    const decodedToken = decodeJwt(token) as { uid: string; exp: number };

    if (decodedToken.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  } catch (err) {
    console.error("Token nieprawidłowy lub brak:", err);
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/users/:path*"],
};
