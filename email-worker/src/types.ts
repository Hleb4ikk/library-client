// Должно совпадать с продюсером на стороне сервера
// (server/src/services/email-queue.service.ts).

export const EmailJobName = {
  AccountSubmission: "account_submission",
  PasswordRecovery: "password_recovery",
} as const;

export type EmailJobName = (typeof EmailJobName)[keyof typeof EmailJobName];

export type EmailJobPayload = {
  receiver: string;
  code: number;
};
