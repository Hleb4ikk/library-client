import type { Request, Response } from "express";
import { authenticateUser, registerUser } from "@/services/auth.service.js";
import ApiError from "@/classes/ApiError.js";

export async function register(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const result = await registerUser(username, password);
        return res.status(201).json({
            success: true,
            message: 'Пользователь успешно создан',
            data: result
        });
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Ошибка при регистрации');
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const result = await authenticateUser(username, password);
        return res.status(200).json({
            success: true,
            message: 'Успешный вход',
            data: result
        });
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Ошибка при авторизации');
    }
}