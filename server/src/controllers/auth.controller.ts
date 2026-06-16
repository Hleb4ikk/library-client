import type { Request, Response } from "express";
import { authService } from "@/services/auth.service.js";
import ApiError from "@/classes/ApiError.js";

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const result = await authService.register(username, password);
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
}

export const authController = new AuthController();