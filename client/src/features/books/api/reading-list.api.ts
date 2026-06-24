import { mockReadingListBooks } from "../data/reading-list.mock";
import type { Book, BookStatus } from "../types/book";

export type ReadingListStatusFilter = "all" | BookStatus;

export type GetReadingListBooksParams = {
    page: number;
    limit: number;
    status?: ReadingListStatusFilter;
};

export type PaginatedBooksResponse = {
    items: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    start: number;
    end: number;
};

let readingListBooks: Book[] = [...mockReadingListBooks];

function delay(ms = 400) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function getReadingListBooks({
    page,
    limit,
    status = "all",
}: GetReadingListBooksParams): Promise<PaginatedBooksResponse> {
    await delay();

    const filteredBooks =
        status === "all"
            ? readingListBooks
            : readingListBooks.filter((book) => book.status === status);

    const total = filteredBooks.length;
    const totalPages = Math.ceil(total / limit);

    const safePage =
        totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages);

    const offset = (safePage - 1) * limit;
    const start = total === 0 ? 0 : offset + 1;
    const end = Math.min(offset + limit, total);

    const items = filteredBooks.slice(offset, offset + limit);

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

export async function updateReadingListBookStatus(
    bookId: string,
    status: BookStatus
): Promise<Book> {
    await delay(250);

    const book = readingListBooks.find((item) => item.id === bookId);

    if (!book) {
        throw new Error("Книга не найдена");
    }

    const updatedBook = {
        ...book,
        status,
    };

    readingListBooks = readingListBooks.map((item) =>
        item.id === bookId ? updatedBook : item
    );

    return updatedBook;
}

export async function deleteReadingListBook(bookId: string): Promise<void> {
    await delay(250);

    readingListBooks = readingListBooks.filter((book) => book.id !== bookId);
}

export async function resetMockReadingListBooks(): Promise<void> {
    await delay(250);

    readingListBooks = [...mockReadingListBooks];
}