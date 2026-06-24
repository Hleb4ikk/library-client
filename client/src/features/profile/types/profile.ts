export type ProfileStats = {
    likes: number;
    readingList: number;
    comments: number;
};

export type UserProfileMock = {
    id: number;
    username: string
    registeredAt: string;
    stats: ProfileStats;
};