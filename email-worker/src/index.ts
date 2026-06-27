import { emailWorker } from "@/email.worker.js";

console.log("[email-worker] запущен, ожидаю задачи из очереди...");

async function shutdown(signal: string): Promise<void> {
  console.log(`[email-worker] получен ${signal}, завершаю работу...`);
  await emailWorker.close();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
