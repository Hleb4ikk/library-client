import type { BookComment } from "../types/book-details";

type CreateCommentPayload = {
    bookId: string;
    text: string;
    authorName: string;
    authorInitials: string;
};

function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
}

export async function createBookComment({
    bookId,
    text,
    authorName,
    authorInitials,
}: CreateCommentPayload): Promise<BookComment> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
        id: crypto.randomUUID(),
        bookId,
        authorName,
        authorInitials,
        text,
        createdAt: getTodayDate(),
        isOwn: true,
    };
}