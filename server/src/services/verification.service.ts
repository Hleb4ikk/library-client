import { cache } from "@/redis/cache.js";

const VERIFICATION_TTL_MS = 15 * 60 * 1000;

export type PendingRegistration = {
  username: string;
  passwordHash: string;
  code: number;
};

export type PendingPasswordRecovery = {
  userId: number;
  code: number;
};

export async function savePendingRegistration(
  email: string,
  data: PendingRegistration,
): Promise<void> {
  await cache.set(`registration:${email}`, data, VERIFICATION_TTL_MS);
}

export async function getPendingRegistration(
  email: string,
): Promise<PendingRegistration | undefined> {
  return cache.get<PendingRegistration>(`registration:${email}`);
}

export async function deletePendingRegistration(email: string): Promise<void> {
  await cache.delete(`registration:${email}`);
}

export async function savePasswordRecovery(
  email: string,
  data: PendingPasswordRecovery,
): Promise<void> {
  await cache.set(`password-recovery:${email}`, data, VERIFICATION_TTL_MS);
}

export async function getPasswordRecovery(
  email: string,
): Promise<PendingPasswordRecovery | undefined> {
  return cache.get<PendingPasswordRecovery>(`password-recovery:${email}`);
}

export async function deletePasswordRecovery(email: string): Promise<void> {
  await cache.delete(`password-recovery:${email}`);
}
