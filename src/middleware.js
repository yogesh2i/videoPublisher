import { getToken } from "next-auth/jwt";
import { nextAuthSecret } from "./utils/constants";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({req,secret: nextAuthSecret});
  if (!token && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }
    if (token && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/content/upload', req.url));
    }
    return NextResponse.next();
}

export const config = {
  matcher: ['/', '/content/upload'],
};