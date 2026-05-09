import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  const connectionString =
    process.env.POSTGRES_PRISMA_URL?.trim() ?? // Vercel Postgres (pgbouncer pooled)
    process.env.POSTGRES_URL_NON_POOLING?.trim() ??
    process.env.POSTGRES_URL?.trim() ??
    process.env.PRISMA_DATABASE_URL?.trim() ??
    process.env.DATABASE_URL?.trim() ??
    "";

  const pool = new Pool({ connectionString: connectionString || undefined, max: 10 });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = undefined;
}
