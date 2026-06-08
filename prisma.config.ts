import path from "node:path";
import { defineConfig, env } from "@prisma/config";

// Prisma 7 config. Load .env for CLI commands (Node 20.12+ / 22).
try {
  process.loadEnvFile();
} catch {
  // .env may be absent in CI where env vars are already set.
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    // Use the DIRECT (non-pooled) connection for migrations.
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
