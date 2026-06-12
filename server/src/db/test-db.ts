import { sql } from "drizzle-orm";
import { db } from "../index.js"; 

async function checkConnection() {
  try {
    console.log("⏳ Стучимся в Supabase через Drizzle...");
    
    const result = await db.execute(sql`SELECT now()`);
    
    console.log("✅ УСПЕХ! Подключение работает отлично.");
    console.log("Ответ от базы:", result);
    process.exit(0);
  } catch (error) {
    console.error("❌ ОШИБКА: Не удалось подключиться к базе данных.");
    console.error(error);
    process.exit(1);
  }
}

checkConnection();