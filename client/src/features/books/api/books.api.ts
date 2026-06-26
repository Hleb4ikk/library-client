import axios from "axios";

import axiosInstance from "../../../api/axios";
import type { Book } from "../types/book";

const HOME_BOOKS_QUERY = "classic literature";
export const BOOKS_PAGE_SIZE = 100;
export const MIN_SEARCH_QUERY_LENGTH = 3;

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiErrorResponse = {
  success: false;
  message: string;
  description?: unknown;
};

type BackendBook = {
  olid: string | null;
  title: string;
  author: string;
  cover_edition_key: string | null;
  cover_url: string | null;
};

type BackendBooksData = {
  books: BackendBook[];
  total_results: number;
  page: number;
};

type SearchParams = {
  q?: string;
  title?: string;
  author?: string;
};

export type GetBooksParams = {
  query?: string;
  page?: number;
  signal?: AbortSignal;
  searchType?: "all" | "title" | "author";
};

export type GetBooksResult = {
  items: Book[];
  total: number;
  page: number;
  totalPages: number;
};

const booksCache = new Map<string, GetBooksResult>();

function getBooksCacheKey(
  query: string | undefined,
  page: number,
  searchType?: string,
) {
  return `${query?.trim() || HOME_BOOKS_QUERY}-${page}-${searchType || "all"}`;
}

export function getCachedBooks(query?: string, page = 1, searchType?: string) {
  const cacheKey = getBooksCacheKey(query, page, searchType);
  return booksCache.get(cacheKey) ?? null;
}

function isRequestAborted(error: unknown) {
  if (axios.isCancel(error)) {
    return true;
  }

  if (error instanceof Error && error.name === "AbortError") {
    return true;
  }

  if (
    axios.isAxiosError(error) &&
    (error.code === "ERR_CANCELED" || error.message === "canceled")
  ) {
    return true;
  }

  return false;
}

function getApiErrorMessage(error: unknown) {
  if (isRequestAborted(error)) {
    return null;
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.code === "ECONNABORTED") {
      return "Сервер не ответил вовремя. Попробуйте ещё раз.";
    }

    if (!error.response) {
      return "Не удалось подключиться к серверу. Проверьте, что backend запущен.";
    }

    if (error.response?.status === 500) {
      return "Сервис поиска временно недоступен. Подождите пару секунд и попробуйте снова.";
    }

    return error.response.data?.message ?? "Ошибка поиска книг";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ошибка поиска книг";
}

function buildCoverUrl(book: BackendBook) {
  if (book.cover_url) {
    return book.cover_url;
  }

  if (book.cover_edition_key) {
    return `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`;
  }

  return undefined;
}

function extractSearchTerm(query?: string) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return null;
  }

  const authorMatch = trimmedQuery.match(/^(?:author|автор)\s*:\s*(.+)$/i);
  if (authorMatch) {
    return authorMatch[1].trim();
  }

  const titleMatch = trimmedQuery.match(/^(?:title|название)\s*:\s*(.+)$/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  return trimmedQuery;
}

export function validateSearchQuery(query?: string): string | null {
  const searchTerm = extractSearchTerm(query);

  if (!searchTerm) {
    return null;
  }

  if (searchTerm.length < MIN_SEARCH_QUERY_LENGTH) {
    return `Введите минимум ${MIN_SEARCH_QUERY_LENGTH} символа для поиска`;
  }

  return null;
}

function buildSearchParams(
  query?: string,
  searchType?: "all" | "title" | "author",
): SearchParams {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return { q: HOME_BOOKS_QUERY };
  }

  // если выбран конкретный тип поиска
  if (searchType === "title") {
    return { title: trimmedQuery };
  }
  if (searchType === "author") {
    return { author: trimmedQuery };
  }

  // проверяем префиксы для обратной совместимости
  const authorMatch = trimmedQuery.match(/^(?:author|автор)\s*:\s*(.+)$/i);
  if (authorMatch) {
    return { author: authorMatch[1].trim() };
  }

  const titleMatch = trimmedQuery.match(/^(?:title|название)\s*:\s*(.+)$/i);
  if (titleMatch) {
    return { title: titleMatch[1].trim() };
  }

  return { q: trimmedQuery };
}

function mapBackendBookToBook(book: BackendBook): Book | null {
  if (!book.olid) {
    return null;
  }

  return {
    id: book.olid,
    title: book.title,
    author: book.author,
    cover: buildCoverUrl(book),
    likes: 0,
  };
}

export async function getBooks({
  query,
  page = 1,
  signal,
  searchType = "all",
}: GetBooksParams = {}): Promise<GetBooksResult> {
  const validationError = validateSearchQuery(query);

  if (validationError) {
    throw new Error(validationError);
  }

  try {
    const searchParams = buildSearchParams(query, searchType);

    const response = await axiosInstance.get<
      ApiSuccessResponse<BackendBooksData>
    >("/books", {
      params: {
        page,
        ...searchParams,
      },
      signal,
      timeout: 45000,
    });

    const payload = response.data?.data;

    if (!payload || !Array.isArray(payload.books)) {
      throw new Error("Некорректный ответ сервера");
    }

    const seenIds = new Set<string>();
    const books = payload.books
      .map(mapBackendBookToBook)
      .filter((book): book is Book => {
        if (!book || seenIds.has(book.id)) {
          return false;
        }

        seenIds.add(book.id);
        return true;
      });

    const total = payload.total_results ?? books.length;
    const totalPages = Math.max(1, Math.ceil(total / BOOKS_PAGE_SIZE));

    const result = {
      items: books,
      total,
      page: payload.page ?? page,
      totalPages,
    };

    booksCache.set(getBooksCacheKey(query, page, searchType), result);

    return result;
  } catch (error) {
    if (isRequestAborted(error)) {
      throw error;
    }

    const message = getApiErrorMessage(error);
    throw new Error(message ?? "Ошибка поиска книг");
  }
}

export { isRequestAborted };

// API для получения деталей книги
type BookDetailsResponse = {
  olid: string;
  title: string;
  description: string;
  covers: number[];
  cover_url: string | null;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
};

export async function getBookDetails(
  olid: string,
): Promise<ApiSuccessResponse<BookDetailsResponse>> {
  try {
    const response = await axiosInstance.get<
      ApiSuccessResponse<BookDetailsResponse>
    >(`/books/${olid}`);

    return response.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message ?? "Ошибка получения деталей книги");
  }
}

// API для переключения лайка
type ToggleLikeResponse = {
  is_liked: boolean;
  likes_count: number;
};

export async function toggleBookLike(
  olid: string,
): Promise<ApiSuccessResponse<ToggleLikeResponse>> {
  try {
    const response = await axiosInstance.post<
      ApiSuccessResponse<ToggleLikeResponse>
    >(`/books/${olid}/like`);

    return response.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    throw new Error(message ?? "Ошибка при изменении лайка");
  }
}
