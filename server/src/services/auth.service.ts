import { createUser } from "@/repositories/user.repository.js";
import { hashPassword } from "@/utils/password.utils.js";

export async function registerUser(username: string, password: string): Promise<{id: number, username: string} | undefined> {
    const passwordHash = await hashPassword(password);
    const user = await createUser({username: username, passwordHash: passwordHash});

    return user;
}