import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV_VARIABLES = [
  'APP_PORT',
  'ACCESS_TOKEN_SECRET',
  'ACCESS_TOKEN_EXPIRES_IN',
  'BCRYPT_SALT_ROUNDS',
  'DATABASE_URL'
] as const;

export function assertRequiredEnvVariables(): void {
  for (const variable of REQUIRED_ENV_VARIABLES) {
    if (!process.env[variable]) {
      throw new Error(`${variable} environment variable is not defined`);
    }
  }
}

assertRequiredEnvVariables();
