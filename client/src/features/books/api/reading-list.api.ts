import axiosInstance from "../../../api/axios";
import type { EStatusBadgeVariant } from "../../../enums/EStatusBadgeVariant";
import type { StatusFilter } from "../../../types/StatusFilter";
import { mockReadingListBooks } from "../data/reading-list.mock";
import type { Book } from "../types/book";

type ApiSuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
};

type ReadingListItem = {
    id: number;
    book_olid: string;
    status: string;
    created_at: string;
    updated_at: string | null;
};

export type GetReadingListBooksParams = {
  page: number;
  limit: number;
  status?: StatusFilter;
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
  status: EStatusBadgeVariant,
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
    item.id === bookId ? updatedBook : item,
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

export async function addOrUpdateBookStatus(
    bookOlid: string,
    status: EStatusBadgeVariant
): Promise<ApiSuccessResponse<ReadingListItem>> {
    const response = await axiosInstance.post<ApiSuccessResponse<ReadingListItem>>(
        "/reading-list",
        { book_olid: bookOlid, status: status }
    );
    return response.data;
}

export async function removeBookFromReadingList(itemId: number): Promise<void> {
    await axiosInstance.delete(`/reading-list/${itemId}`);
}
