import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/** Parse a mysql:// or mysql2:// URL into individual connection params */
function parseDbUrl(url: string) {
  try {
    const u = new URL(url.replace(/^mysql2?:\/\//, "http://"));
    return {
      host: u.hostname || "127.0.0.1",
      port: parseInt(u.port) || 3306,
      user: decodeURIComponent(u.username) || "root",
      password: decodeURIComponent(u.password) || "",
      database: u.pathname.replace(/^\//, "") || "new_wardrobe",
    };
  } catch {
    return {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "new_wardrobe",
    };
  }
}

function createPrismaClient() {
  const conn = parseDbUrl(process.env.DATABASE_URL ?? "mysql://root:@localhost:3306/new_wardrobe");
  const adapter = new PrismaMariaDb({ ...conn, connectionLimit: 10 });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());

if (process.env.NODE_ENV !== "production") {
  // Reset singleton on each module reload (HMR) so prisma generate takes effect
  globalForPrisma.prisma = undefined;
}
