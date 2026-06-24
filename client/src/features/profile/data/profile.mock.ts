import { MOCK_USER } from "../../auth/mock-user";
import type { UserProfileMock } from "../types/profile";

export const MOCK_PROFILE_PASSWORD = "password123";

export const mockTakenUsernames = [
    "admin",
    "reader_one",
    "booklover",
    "alex_reads",
    "maria",
];

export const mockUserProfile: UserProfileMock = {
    id: MOCK_USER.id,
    username: MOCK_USER.username,
    email: MOCK_USER.email,
    registeredAt: MOCK_USER.registeredAt ?? "2024-03-12",
    stats: {
        likes: 3,
        readingList: 4,
        comments: 2,
    },
};