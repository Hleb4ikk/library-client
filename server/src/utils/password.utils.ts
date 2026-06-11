import bcrypt from 'bcrypt';

import { appConfig } from '@/appConfig.js';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, appConfig.bcrypt.saltRounds);
}

export async function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch {
    return false;
  }
}
