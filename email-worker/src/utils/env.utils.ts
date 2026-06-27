import dotenv from "dotenv";

dotenv.config();

const REQUIRED_ENV_VARIABLES = [
  "REDIS_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
] as const;

export function assertRequiredEnvVariables(): void {
  for (const variable of REQUIRED_ENV_VARIABLES) {
    if (!process.env[variable]) {
      throw new Error(`${variable} environment variable is not defined`);
    }
  }
}

assertRequiredEnvVariables();
