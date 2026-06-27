import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { appConfig } from "@/appConfig.js";
import { EmailJobName, type EmailJobPayload } from "@/types.js";
import {
  sendAccountSubmissionEmail,
  sendPasswordRecoveryEmail,
} from "@/services/email.service.js";

const connection = new Redis(appConfig.redisUrl, {
  maxRetriesPerRequest: null,
});

export const emailWorker = new Worker<EmailJobPayload>(
  appConfig.queueName,
  async (job) => {
    const { receiver, code } = job.data;

    switch (job.name) {
      case EmailJobName.AccountSubmission:
        await sendAccountSubmissionEmail(receiver, code);
        break;
      case EmailJobName.PasswordRecovery:
        await sendPasswordRecoveryEmail(receiver, code);
        break;
      default:
        throw new Error(`Неизвестный тип email-задачи: ${job.name}`);
    }
  },
  {
    connection,
    concurrency: appConfig.concurrency,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`[email-worker] задача ${job.id} (${job.name}) выполнена`);
});

emailWorker.on("failed", (job, err) => {
  console.error(
    `[email-worker] задача ${job?.id} (${job?.name}) провалена:`,
    err,
  );
});
