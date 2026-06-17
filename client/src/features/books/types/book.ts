export type Book = {
    id: string;
    title: string;
    author: string;
    cover?: string;
    status?: string;
    likes: number;
    isLiked?: boolean;
};