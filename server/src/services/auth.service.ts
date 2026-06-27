import ApiError from "@/classes/ApiError.js";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  updateUserPassword,
} from "@/repositories/user.repository.js";
import { hashPassword, comparePassword } from "@/utils/password.utils.js";
import { generateAccessToken } from "@/utils/token.utils.js";
import {
  enqueueAccountSubmission,
  enqueuePasswordRecovery,
  generateVerificationCode,
} from "@/services/email-queue.service.js";
import {
  deletePasswordRecovery,
  deletePendingRegistration,
  getPasswordRecovery,
  getPendingRegistration,
  savePasswordRecovery,
  savePendingRegistration,
} from "@/services/verification.service.js";

export async function startRegistration(
  username: string,
  email: string,
  password: string,
): Promise<{ email: string }> {
  const normalizedEmail = email.toLowerCase();

  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new ApiError(409, "Пользователь с таким именем уже существует");
  }

  const existingEmail = await findUserByEmail(normalizedEmail);
  if (existingEmail) {
    throw new ApiError(409, "Пользователь с таким email уже существует");
  }

  const passwordHash = await hashPassword(password);
  const code = generateVerificationCode();

  await savePendingRegistration(normalizedEmail, {
    username,
    passwordHash,
    code,
  });

  await enqueueAccountSubmission({ receiver: normalizedEmail, code });

  return { email: normalizedEmail };
}

export async function verifyEmail(
  email: string,
  code: number,
): Promise<{
  user: { id: number; username: string; email: string };
  token: string;
}> {
  const normalizedEmail = email.toLowerCase();
  const pending = await getPendingRegistration(normalizedEmail);

  if (!pending) {
    throw new ApiError(400, "Код подтверждения истёк или регистрация не найдена");
  }

  if (pending.code !== code) {
    throw new ApiError(400, "Неверный код подтверждения");
  }

  const existingUser = await findUserByUsername(pending.username);
  if (existingUser) {
    await deletePendingRegistration(normalizedEmail);
    throw new ApiError(409, "Пользователь с таким именем уже существует");
  }

  const existingEmail = await findUserByEmail(normalizedEmail);
  if (existingEmail) {
    await deletePendingRegistration(normalizedEmail);
    throw new ApiError(409, "Пользователь с таким email уже существует");
  }

  const user = await createUser({
    username: pending.username,
    email: normalizedEmail,
    passwordHash: pending.passwordHash,
    isEmailVerified: true,
  });

  if (!user || !user.email) {
    throw new ApiError(500, "Не удалось создать пользователя");
  }

  await deletePendingRegistration(normalizedEmail);

  const token = generateAccessToken(user.id);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    token,
  };
}

export async function resendVerificationCode(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  const pending = await getPendingRegistration(normalizedEmail);

  if (!pending) {
    throw new ApiError(400, "Регистрация не найдена или код уже истёк");
  }

  const code = generateVerificationCode();

  await savePendingRegistration(normalizedEmail, {
    ...pending,
    code,
  });

  await enqueueAccountSubmission({ receiver: normalizedEmail, code });
}

export async function requestPasswordRecovery(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(404, "Пользователь с таким email не найден");
  }

  const code = generateVerificationCode();

  await savePasswordRecovery(normalizedEmail, {
    userId: user.id,
    code,
  });

  await enqueuePasswordRecovery({ receiver: normalizedEmail, code });
}

export async function resetPassword(
  email: string,
  code: number,
  password: string,
): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  const recovery = await getPasswordRecovery(normalizedEmail);

  if (!recovery) {
    throw new ApiError(400, "Код восстановления истёк или не найден");
  }

  if (recovery.code !== code) {
    throw new ApiError(400, "Неверный код восстановления");
  }

  const user = await findUserByEmail(normalizedEmail);
  if (!user || user.id !== recovery.userId) {
    throw new ApiError(404, "Пользователь не найден");
  }

  const isSamePassword = await comparePassword(password, user.passwordHash);
  if (isSamePassword) {
    throw new ApiError(400, "Новый пароль совпадает с текущим");
  }

  const passwordHash = await hashPassword(password);
  await updateUserPassword(user.id, passwordHash);
  await deletePasswordRecovery(normalizedEmail);
}

export async function authenticateUser(
  username: string,
  password: string,
): Promise<{
  user: { id: number; username: string };
  token: string;
}> {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new ApiError(401, "Неверное имя пользователя или пароль");
  }

  if (user.email && !user.isEmailVerified) {
    throw new ApiError(403, "Email не подтверждён");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Неверное имя пользователя или пароль");
  }

  const token = generateAccessToken(user.id);

  return {
    user: {
      id: user.id,
      username: user.username,
    },
    token,
  };
}
