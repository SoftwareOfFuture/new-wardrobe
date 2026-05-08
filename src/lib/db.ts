import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/** Parse a mysql:// URL into MariaDB adapter connection params */
function parseDbUrl(rawUrl: string) {
  const defaults = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "new_wardrobe",
  };

  try {
    // Replace mysql:// or mysql2:// with http:// so URL API can parse it
    const normalized = rawUrl.trim().replace(/^mysql2?:\/\//, "http://");
    const u = new URL(normalized);
    return {
      host: u.hostname || defaults.host,
      port: parseInt(u.port) || defaults.port,
      user: decodeURIComponent(u.username) || defaults.user,
      password: decodeURIComponent(u.password) || defaults.password,
      database: u.pathname.replace(/^\//, "") || defaults.database,
    };
  } catch {
    console.error("[db] Could not parse DATABASE_URL, using defaults");
    return defaults;
  }
}

function createPrismaClient() {
  const conn = parseDbUrl(
    process.env.DATABASE_URL ?? "mysql://root:@127.0.0.1:3306/new_wardrobe"
  );
  const adapter = new PrismaMariaDb({ ...conn, connectionLimit: 10 });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());

// In dev, clear singleton so `prisma generate` changes take effect on next HMR
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = undefined;
}
