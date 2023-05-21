import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";

import { SignJWT } from "jose";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function sign(payload: Object, secret: string): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(new TextEncoder().encode(secret));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await prisma.$connect();
  const user = await prisma.user.findUnique({ where: { id: 1 } });
  setCookie("authToken", await sign(user!, "secret"), { req, res });
  return res.json(user);
}
