export type ProfileStats = {
    likes: number;
    readingList: number;
    comments: number;
};

export type UserProfileMock = {
    id: string;
    username: string;
    email?: string;
    registeredAt: string;
    stats: ProfileStats;
};