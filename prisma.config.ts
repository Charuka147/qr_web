import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Load .env.local first (Next.js convention), then fallback to .env
dotenv.config({ path: ".env.local" });
dotenv.config();

// DIRECT_URL (port 5432) is used by the Prisma CLI for migrations / db push.
// DATABASE_URL (pooled or direct) is used at runtime.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
