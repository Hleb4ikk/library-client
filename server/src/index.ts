import express from 'express';

import { appConfig } from '@/appConfig.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

const app = express();
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ ОШИБКА: Переменная DATABASE_URL не найдена в файле .env");
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);

console.log("✅ Drizzle инициализирован");

app.listen(appConfig.port, (error) => {
  if (!error) {
    console.log(`Server started on port - ${appConfig.port}`);
  } else {
    console.log(`Failed to start server: ${error}`);
  }
});
