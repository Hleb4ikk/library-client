import ApiError from "@/classes/ApiError.js";
import { createUser, findUserByUsername } from "@/repositories/user.repository.js";
import { hashPassword } from "@/utils/password.utils.js";

export async function registerUser(username: string, password: string): Promise<{id: number, username: string} | undefined> {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        throw new ApiError(409, 'Пользователь с таким именем уже существует');
    }

    const passwordHash = await hashPassword(password);

    const user = await createUser({username: username, passwordHash: passwordHash});

    if (!user) {
        throw new ApiError(500, 'Не удалось создать пользователя');
    }

    return user;
}