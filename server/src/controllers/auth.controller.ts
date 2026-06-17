import type { Request, Response } from "express";
import { registerUser } from "@/services/auth.service.js";
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
        throw new ApiError(400, (error as Error).message);
    }
}