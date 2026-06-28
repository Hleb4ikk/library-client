import { likesRepository } from "@/repositories/likes.repository.js";
import {
  userBooksRepository,
  type UserBookSource,
  type UserBookSourceType,
} from "@/repositories/user-books.repository.js";
import type { BookMetadata } from "@/repositories/books-cache.repository.js";
import { booksService } from "./books.service.js";

type SearchUserBooksFilters = {
  q?: string;
  type: UserBookSourceType;
  page: number;
  limit: number;
};

function matchesQuery(
  olid: string,
  title: string,
  author: string,
  query: string,
): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [olid, title, author].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

async function filterUserBooksByQuery(
  userBooks: UserBookSource[],
  query: string,
): Promise<UserBookSource[]> {
  const metadataMap = await booksService.ensureBooksCached(
    userBooks.map((book) => book.bookOlid),
  );

  return userBooks.filter((source) => {
    const metadata = metadataMap.get(source.bookOlid);
    if (!metadata) return false;
    return matchesQuery(
      source.bookOlid,
      metadata.title,
      metadata.author,
      query,
    );
  });
}

function buildBookResult(
  source: UserBookSource,
  metadata: BookMetadata,
  likesCount: number,
) {
  return {
    olid: source.bookOlid,
    title: metadata.title,
    author: metadata.author,
    cover_url: metadata.cover_url,
    is_liked: source.isLiked,
    reading_list_status: source.readingListStatus,
    likes_count: likesCount,
  };
}

export async function searchUserBooks(
  userId: number,
  filters: SearchUserBooksFilters,
) {
  const userBooks = await userBooksRepository.findAllUserBooks(
    userId,
    filters.type,
  );

  if (userBooks.length === 0) {
    return {
      books: [],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  const filteredBooks = filters.q
    ? await filterUserBooksByQuery(userBooks, filters.q)
    : userBooks;

  const total = filteredBooks.length;
  const offset = (filters.page - 1) * filters.limit;
  const paginatedSources = filteredBooks.slice(offset, offset + filters.limit);
  const metadataMap = await booksService.ensureBooksCached(
    paginatedSources.map((book) => book.bookOlid),
  );
  const likesCounts = await likesRepository.getLikesCountsForOlids(
    paginatedSources.map((book) => book.bookOlid),
  );

  const books = paginatedSources
    .map((source) => {
      const metadata = metadataMap.get(source.bookOlid);
      if (!metadata) return null;
      return buildBookResult(
        source,
        metadata,
        likesCounts.get(source.bookOlid) ?? 0,
      );
    })
    .filter((book): book is NonNullable<typeof book> => book !== null);

  return {
    books,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}
