import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use non-pooling URL for migrations (pgbouncer doesn't support DDL transactions)
    url:
      process.env["POSTGRES_URL_NON_POOLING"] ??
      process.env["DATABASE_URL"],
  },
});
