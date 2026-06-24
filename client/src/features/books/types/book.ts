export type BookStatus = "Хочу прочитать" | "Читаю сейчас" | "Прочитано";

export type Book = {
    id: string;
    title: string;
    author: string;
    cover?: string;
    status?: BookStatus;
    likes: number;
    isLiked?: boolean;
};