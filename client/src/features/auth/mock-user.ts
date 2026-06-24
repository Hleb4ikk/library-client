import type { User } from "./user";

export const MOCK_USER: User = {
    id: "1",
    username: "maria_k",
    email: "maria@example.com",
    registeredAt: "2026-06-12",
};

export const IS_MOCK_USER_AUTHORIZED = true;

export const MOCK_CURRENT_USER: User | null = IS_MOCK_USER_AUTHORIZED
    ? MOCK_USER
    : null;