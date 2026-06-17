import type { User } from "./user";

export const MOCK_USER: User = {
    id: "1",
    username: "maria_k",
    email: "maria@example.com",
};

export const IS_MOCK_USER_AUTHORIZED = false;

export const MOCK_CURRENT_USER: User | null = IS_MOCK_USER_AUTHORIZED
    ? MOCK_USER
    : null;