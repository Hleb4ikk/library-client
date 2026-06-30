import { eq } from "drizzle-orm";
import { db } from "@/database/db.js";
import { users } from "@/database/schemas/users.js";
import type { NewUser, User } from "@/database/schemas/users.js";

export async function createUser(data: NewUser): Promise<{id: number, username: string, email: string | null} | undefined> {
    const [user] = await db.insert(users).values(data).returning({
        id: users.id,
        username: users.username,
        email: users.email,
    });
    return user;
}

export async function findUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
}

export async function updateUserUsername(id: number, username: string): Promise<{id: number, username: string, createdAt: Date} | undefined> {
    const [user] = await db.update(users).set({username: username}).where(eq(users.id, id)).returning({id: users.id, username: users.username, createdAt: users.createdAt});
    return user;
}

export async function updateUserPassword(id: number, passwordHash: string): Promise<void> {
    await db.update(users).set({passwordHash: passwordHash}).where(eq(users.id, id));
}