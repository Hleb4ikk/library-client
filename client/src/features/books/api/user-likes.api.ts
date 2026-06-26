import { mockLikedBooks } from "../data/user-likes.mock";
import type { Book } from "../types/book";

export type GetLikedBooksParams = {
    page: number;
    limit: number;
};

export type PaginatedLikedBooksResponse = {
    items: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    start: number;
    end: number;
};

let likedBooks: Book[] = [...mockLikedBooks];

function delay(ms = 400) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function getLikedBooks({
    page,
    limit,
}: GetLikedBooksParams): Promise<PaginatedLikedBooksResponse> {
    await delay();

    const total = likedBooks.length;
    const totalPages = Math.ceil(total / limit);
    const safePage =
        totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages);

    const offset = (safePage - 1) * limit;
    const start = total === 0 ? 0 : offset + 1;
    const end = Math.min(offset + limit, total);
    const items = likedBooks.slice(offset, offset + limit);

    return {
        items,
        total,
        page: safePage,
        limit,
        totalPages,
        start,
        end,
    };
}

export async function removeLikedBook(bookId: string): Promise<void> {
    await delay(250);

    likedBooks = likedBooks.filter((book) => book.id !== bookId);
}

export async function resetMockLikedBooks(): Promise<void> {
    await delay(250);

    likedBooks = [...mockLikedBooks];
}