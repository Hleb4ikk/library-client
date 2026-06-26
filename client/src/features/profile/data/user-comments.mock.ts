import type { UserComment } from "../types/user-comment";

export const mockUserComments: UserComment[] = [
    {
        id: "comment-1",
        bookId: "thinking-fast-and-slow",
        bookTitle: "Thinking, Fast and Slow",
        text: "Dense but very rewarding. I had to read it slowly to digest all the concepts.",
        createdAt: "2024-04-02",
    },
    {
        id: "comment-2",
        bookId: "the-great-gatsby",
        bookTitle: "The Great Gatsby",
        text: "Beautiful prose, but the characters felt hollow to me.",
        createdAt: "2024-03-28",
    },
    {
        id: "comment-3",
        bookId: "1984",
        bookTitle: "1984",
        text: "Очень сильная атмосфера. После чтения ещё долго думаешь о контроле и свободе.",
        createdAt: "2024-04-16",
    },
    {
        id: "comment-4",
        bookId: "the-hobbit",
        bookTitle: "The Hobbit",
        text: "Лёгкое приключение, которое приятно читать вечером. Особенно понравилось ощущение дороги.",
        createdAt: "2024-05-01",
    },
    {
        id: "comment-5",
        bookId: "to-kill-a-mockingbird",
        bookTitle: "To Kill a Mockingbird",
        text: "История спокойная по темпу, но очень цепляет темами справедливости и взросления.",
        createdAt: "2024-05-12",
    },
];