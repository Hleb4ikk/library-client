import { userRepository } from "@/repositories/user.repository.js";
import { hashPassword } from "@/utils/password.utils.js";

class AuthService {
    async register(username: string, password: string) {
        const passwordHash = await hashPassword(password);
        const user = await userRepository.create({username: username, passwordHash: passwordHash});

        return user;
    }
}

export const authService = new AuthService();