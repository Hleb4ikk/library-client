import type { Request, Response } from "express";
import {
  getUser,
  getUserComments,
  getUserLikes,
  updatePassword,
  updateUsername,
} from "@/services/users.service.js";
import { searchUserBooks } from "@/services/me-books.service.js";
import ApiError from "@/classes/ApiError.js";

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const user = await getUser(userId);
    return res.status(200).json({
      success: true,
      message: "Профиль успешно получен",
      data: user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при получении профиля");
  }
}

export async function changeLogin(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const newUsername = req.body.new_username;
    const user = await updateUsername(userId, newUsername);
    return res.status(200).json({
      success: true,
      message: "Логин успешно изменён",
      data: user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при изменении логина");
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const currentPassword = req.body.current_password;
    const newPassword = req.body.new_password;
    await updatePassword(userId, currentPassword, newPassword);
    return res.status(200).json({
      success: true,
      message: "Пароль успешно изменён",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при изменении пароля");
  }
}

export async function getLikes(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const userId = req.userId!;

    const result = await getUserLikes(userId, page, limit);

    return res.status(200).json({
      success: true,
      message: "Список лайков успешно получен",
      data: result,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при изменении пароля");
  }
}

export async function searchMyBooks(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const q = req.query.q as string | undefined;
    const type = (req.query.type as "likes" | "reading_list" | "all") ?? "all";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await searchUserBooks(userId, {
      type,
      page,
      limit,
      ...(q ? { q } : {}),
    });

    return res.status(200).json({
      success: true,
      message: "Книги успешно найдены",
      data: result,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при поиске книг");
  }
}
export async function getComments(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const userId = req.userId!;

    const result = await getUserComments(userId, page, limit);

    return res.status(200).json({
      success: true,
      message: "Список лайков успешно получен",
      data: result,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при изменении пароля");
  }
}
