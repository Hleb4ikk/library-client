import "@/utils/env.utils.js";

export const appConfig = {
  redisUrl: process.env.REDIS_URL!,
  queueName: process.env.EMAIL_QUEUE_NAME ?? "email-queue",
  concurrency: Number(process.env.WORKER_CONCURRENCY ?? 5),
  smtp: {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    from: process.env.MAIL_FROM ?? "no-reply@library.local",
  },
};
