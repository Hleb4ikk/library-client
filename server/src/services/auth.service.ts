import ApiError from "@/classes/ApiError.js";
import { createUser, findUserByUsername } from "@/repositories/user.repository.js";
import type { AccessTokenPayload } from "@/schemas/access-token-payload.schema.js";
import { hashPassword, comparePassword } from "@/utils/password.utils.js";
import { generateAccessToken } from "@/utils/token.utils.js";

export async function registerUser(username: string, password: string): Promise<{id: number, username: string} | undefined> {
    const passwordHash = await hashPassword(password);
    const user = await createUser({username: username, passwordHash: passwordHash});

    return user;
}

export async function authenticateUser(username: string, password: string): Promise<{ 
    user: {id: number, username: string}, 
    token: string 
}> {
    const user = await findUserByUsername(username);
    if (!user) {
        throw new ApiError(401, 'Неверное имя пользователя или пароль');
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Неверное имя пользователя или пароль');
    }

    const token = generateAccessToken(user.id);

    return {
        user: {
            id: user.id,
            username: user.username
        },
        token: token
    }
}