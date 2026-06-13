import { appConfig } from "@/appConfig.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: appConfig.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.log("[Postgres Pool Error]", err.message);
});

export const db = drizzle(pool);
