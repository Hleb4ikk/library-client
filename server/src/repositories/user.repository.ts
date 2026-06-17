import { eq } from "drizzle-orm";
import { db } from "@/database/db.js";
import { users } from "@/database/schemas/users.js";
import type { NewUser, User } from "@/database/schemas/users.js";

export async function createUser(data: NewUser): Promise<{id: number, username: string} | undefined> {
    const [user] = await db.insert(users).values(data).returning({id: users.id, username: users.username});
    return user;
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
}