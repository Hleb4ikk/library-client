import type { BookStatus } from "./book";

export type BookComment = {
    id: string;
    bookId: string;
    authorName: string;
    authorInitials: string;
    text: string;
    createdAt: string;
    isOwn?: boolean;
};

export type BookDetails = {
    id: string;
    title: string;
    author: string;
    year: number;
    cover?: string;
    description: string;
    likes: number;
    isLiked?: boolean;
    readingStatus?: BookStatus;
    comments: BookComment[];
};