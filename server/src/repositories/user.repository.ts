import { db } from "@/database/db.js";
import { users } from "@/database/schemas/users.js";
import type { NewUser } from "@/database/schemas/users.js";

class UserRepository {
    async create(data: NewUser) {
        const user = await db.insert(users).values(data).returning({id: users.id, username: users.username});
        return user;
    }
}

export const userRepository = new UserRepository();