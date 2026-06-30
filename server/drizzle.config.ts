import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schemas/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    // Для миграций нужен session-пулер/прямое подключение (:5432) — transaction-
    // пулер Supabase (:6543) не поддерживает DDL-миграции. Берём отдельный
    // MIGRATION_DATABASE_URL, с фолбэком на основной DATABASE_URL.
    url: process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
