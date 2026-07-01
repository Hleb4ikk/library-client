import { emailWorker } from "@/email.worker.js";
import { createServer } from "node:http";

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "Server running!",
    }),
  );
});

httpServer.listen(8081);

console.log("[email-worker] запущен, ожидаю задачи из очереди...");

async function shutdown(signal: string): Promise<void> {
  console.log(`[email-worker] получен ${signal}, завершаю работу...`);
  await emailWorker.close();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
