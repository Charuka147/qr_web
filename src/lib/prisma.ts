import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Server-only singleton. Prisma connects directly to PostgreSQL, bypassing
// Supabase Row Level Security. Callers MUST scope every query by the authenticated
// user's workspace_id to guarantee multi-tenant security.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured in environment. Please provide your Supabase PostgreSQL connection string in .env.local (see .env.example)."
    );
  }

  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

/**
 * Lazy proxy to PrismaClient. Avoids eager connection attempt during module evaluation
 * if DATABASE_URL is not yet supplied.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
