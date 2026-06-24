import type { Request, Response } from "express";
import { getUser } from "@/services/users.service.js";
import ApiError from "@/classes/ApiError.js";

export async function getProfile(req: Request, res: Response) {
    try {
        const userId = req.userId!;
        const user = await getUser(userId);
        return res.status(200).json({
            success: true,
            message: 'Профиль успешно получен',
            data: user
        });
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Ошибка при получении профиля');
    }
}