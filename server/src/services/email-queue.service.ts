import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { appConfig } from "@/appConfig.js";

const connection = new Redis(appConfig.redisUrl, {
  maxRetriesPerRequest: null,
});

const emailQueue = new Queue("email-queue", { connection });

type EmailJobPayload = {
  receiver: string;
  code: number;
};

export async function enqueueAccountSubmission(payload: EmailJobPayload) {
  await emailQueue.add("account_submission", payload);
}

export async function enqueuePasswordRecovery(payload: EmailJobPayload) {
  await emailQueue.add("password_recovery", payload);
}

export function generateVerificationCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}
