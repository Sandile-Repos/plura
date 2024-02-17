import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient(); //so we dont create multiple client on every single reload

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
