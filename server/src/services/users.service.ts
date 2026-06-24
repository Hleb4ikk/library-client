import ApiError from "@/classes/ApiError.js";
import { findUserById } from "@/repositories/user.repository.js";

export async function getUser(userId: number): Promise<{id: number, username: string, createdAt: Date}> {
    const user = await findUserById(userId);
    if (!user) {
        throw new ApiError(404, 'Пользователь не найден');
    }

    return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
    }
}
