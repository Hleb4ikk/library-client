import type { Request, Response } from "express";
import {
  authenticateUser,
  requestPasswordRecovery,
  resendVerificationCode,
  resetPassword,
  startRegistration,
  verifyEmail,
} from "@/services/auth.service.js";
import ApiError from "@/classes/ApiError.js";

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const result = await startRegistration(username, email, password);
    return res.status(202).json({
      success: true,
      message: "Код подтверждения отправлен на email",
      data: result,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при регистрации");
  }
}

export async function verifyEmailHandler(req: Request, res: Response) {
  try {
    const { email, code } = req.body;
    const result = await verifyEmail(email, code);
    return res.status(201).json({
      success: true,
      message: "Email подтверждён, аккаунт создан",
      data: result,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при подтверждении email");
  }
}

export async function resendVerification(req: Request, res: Response) {
  try {
    const { email } = req.body;
    await resendVerificationCode(email);
    return res.status(200).json({
      success: true,
      message: "Код подтверждения отправлен повторно",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при повторной отправке кода");
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    await requestPasswordRecovery(email);
    return res.status(200).json({
      success: true,
      message: "Код восстановления отправлен на email",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при восстановлении пароля");
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const { email, code, password } = req.body;
    await resetPassword(email, code, password);
    return res.status(200).json({
      success: true,
      message: "Пароль успешно изменён",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при смене пароля");
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const result = await authenticateUser(username, password);
    return res.status(200).json({
      success: true,
      message: "Успешный вход",
      data: result,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при авторизации");
  }
}
