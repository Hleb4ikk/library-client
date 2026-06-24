import ApiError from "@/classes/ApiError.js";
import { findUserById, findUserByUsername, updateUserUsername } from "@/repositories/user.repository.js";

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

export async function updateUsername(userId: number, newUsername: string): Promise<{id: number, username: string, createdAt: Date}> {
    const existingUser = await findUserByUsername(newUsername);
    if (existingUser) {
        if (existingUser.id === userId) throw new ApiError(409, 'Новый логин совпадает с текущим');
        throw new ApiError(409, 'Логин уже занят другим пользователем');
    }

    const user = await updateUserUsername(userId, newUsername);
    if (!user) {
        throw new ApiError(404, 'Пользователь не найден');
    }

    return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
    }
}