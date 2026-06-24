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
    id: 1,
    username: "reader_user",
    registeredAt: "2024-03-12",
    stats: {
        likes: 3,
        readingList: 4,
        comments: 2,
    },
};