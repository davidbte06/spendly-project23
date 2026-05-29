import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load environment variables from .env.local file
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // The URL for the PostgreSQL database is read from environment variables.
    url: process.env["POSTGRES_PRISMA_URL"] || process.env["DATABASE_URL"],
  },
});