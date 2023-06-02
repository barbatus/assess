import { NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { IncomingMessage } from "http";

import { User } from "~/goodreads/prisma/generated/type-graphql";

export async function verify(token?: string) {
  const { payload } = await jwtVerify(token || "", new TextEncoder().encode("secret"));
  return payload;
}

export async function getUser(
  req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> },
): Promise<User> {
  return (await verify(req.cookies["authToken"])) as unknown as User;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }
  await verify(token);
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home/:path*", "/edit/:path*", "/add"],
};
