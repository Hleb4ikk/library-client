import axios from "axios";
import { likesRepository } from "@/repositories/likes.repository.js";
import { commentsRepository } from "@/repositories/comments.repository.js";
import {
  booksCacheRepository,
  type BookMetadata,
} from "@/repositories/books-cache.repository.js";
import ApiError from "@/classes/ApiError.js";
import { wsService } from "./ws.service.js";
import { rateLimited } from "@/utils/rate-limiter.utils.js";
import { getOrSet } from "@/redis/cache.js";
import { generateCacheKey } from "@/utils/cache.utils.js";
import { getCoverBlurhash } from "@/utils/blurhash.utils.js";
const OPEN_LIBRARY_URL = "https://openlibrary.org";

export const booksService = {
  async fetchBookMetadataFromOpenLibrary(olid: string): Promise<BookMetadata> {
    const cacheKey = generateCacheKey("books:metadata", { olid });

    return getOrSet(cacheKey, async () => {
      const response = await rateLimited(() =>
        axios.get(`${OPEN_LIBRARY_URL}/search.json`, {
          params: {
            q: `key:/works/${olid}`,
            fields: "key,title,author_name,cover_i",
            limit: 1,
          },
        }),
      ).catch(() => null);

      const doc = response?.data?.docs?.[0];
      if (doc) {
        return {
          olid,
          title: doc.title || "Без названия",
          author: doc.author_name
            ? doc.author_name.join(", ")
            : "Неизвестный автор",
          cover_url: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : null,
        };
      }

      const workResponse = await rateLimited(() =>
        axios.get(`${OPEN_LIBRARY_URL}/works/${olid}.json`),
      ).catch(() => null);

      if (!workResponse) {
        throw new ApiError(404, "Книга не найдена в Open Library");
      }

      const data = workResponse.data;
      return {
        olid,
        title: data.title || "Без названия",
        author: "Неизвестный автор",
        cover_url:
          data.covers && data.covers.length > 0
            ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`
            : null,
      };
    });
  },

  async getOrCacheBookMetadata(olid: string): Promise<BookMetadata> {
    const cached = await booksCacheRepository.findByOlid(olid);
    if (cached) {
      return {
        olid: cached.olid,
        title: cached.title,
        author: cached.author,
        cover_url: cached.coverUrl,
      };
    }

    let metadata: BookMetadata;
    try {
      metadata = await this.fetchBookMetadataFromOpenLibrary(olid);
    } catch (error) {
      console.error(
        `[books] Не удалось получить метаданные книги ${olid} из Open Library:`,
        error,
      );
      metadata = {
        olid,
        title: olid,
        author: "Неизвестный автор",
        cover_url: null,
      };
    }

    try {
      await booksCacheRepository.upsert(metadata);
    } catch (error) {
      console.error(
        `[books] Не удалось сохранить метаданные книги ${olid} в кеш:`,
        error,
      );
    }

    return metadata;
  },

  async ensureBooksCached(olids: string[]) {
    const uniqueOlids = [...new Set(olids)];
    const cachedEntries = await booksCacheRepository.findByOlids(uniqueOlids);
    const metadataMap = new Map<string, BookMetadata>(
      cachedEntries.map((entry) => [
        entry.olid,
        {
          olid: entry.olid,
          title: entry.title,
          author: entry.author,
          cover_url: entry.coverUrl,
        },
      ]),
    );

    const missingOlids = uniqueOlids.filter((olid) => !metadataMap.has(olid));
    await Promise.all(
      missingOlids.map(async (olid) => {
        const metadata = await this.getOrCacheBookMetadata(olid);
        metadataMap.set(olid, metadata);
      }),
    );

    return metadataMap;
  },

  async searchBooks(filters: {
    q?: string;
    title?: string;
    author?: string;
    page: number;
  }) {
    const cacheKey = generateCacheKey("books:search", {
      q: filters.q,
      title: filters.title,
      author: filters.author,
      page: filters.page,
    });

    return getOrSet(cacheKey, async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("page", filters.page.toString());
      if (filters.q) searchParams.append("q", filters.q);
      if (filters.title) searchParams.append("title", filters.title);
      if (filters.author) searchParams.append("author", filters.author);

      const response = await rateLimited(() =>
        axios.get(`${OPEN_LIBRARY_URL}/search.json`, {
          params: Object.fromEntries(searchParams),
        }),
      );

      const docs = response.data.docs || [];
      const formattedBooks = await Promise.all(
        docs.map(async (book: any) => {
          const coverUrl = book.cover_edition_key
            ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
            : null;

          return {
            olid: book.key ? book.key.replace("/works/", "") : null,
            title: book.title,
            author: book.author_name
              ? book.author_name.join(", ")
              : "Неизвестный автор",
            cover_edition_key: book.cover_edition_key || null,
            cover_url: coverUrl,
            blurhash: await getCoverBlurhash(coverUrl),
          };
        }),
      );

      return {
        books: formattedBooks,
        total_results: response.data.numFound || 0,
      };
    });
  },

  async getBookDetails(olid: string, currentUserId: number | null) {
    const cacheKey = generateCacheKey("books:details", { olid });

    const [workData, likesCount, commentsCount] = await Promise.all([
      getOrSet(cacheKey, async () => {
        const apiResponse = await rateLimited(() =>
          axios.get(`${OPEN_LIBRARY_URL}/works/${olid}.json`),
        ).catch(() => null);

        if (!apiResponse)
          throw new ApiError(404, "Книга не найдена в Open Library");

        const data = apiResponse.data;
        let description = "";
        if (typeof data.description === "string")
          description = data.description;
        else if (data.description && data.description.value)
          description = data.description.value;

        return {
          title: data.title,
          description: description || "Описание отсутствует.",
          covers: data.covers || [],
          cover_url:
            data.covers && data.covers.length > 0
              ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
              : null,
        };
      }),
      likesRepository.getLikesCount(olid),
      commentsRepository.getCommentsCount(olid),
    ]);

    const isLiked = currentUserId
      ? await likesRepository.checkIsLiked(olid, currentUserId)
      : false;

    return {
      olid,
      ...workData,
      likes_count: likesCount,
      comments_count: commentsCount,
      is_liked: isLiked,
    };
  },

  async getBookComments(olid: string, page: number) {
    const limit = 10;
    const offset = (page - 1) * limit;

    const [commentsList, totalCount] = await Promise.all([
      commentsRepository.getCommentsList(olid, limit, offset),
      commentsRepository.getCommentsCount(olid),
    ]);

    return { comments: commentsList, total_results: totalCount, limit };
  },

  async addComment(bookOlid: string, text: string, userId: number) {
    const newComment = await commentsRepository.createComment(bookOlid, text);
    if (!newComment) {
      throw new ApiError(500, "Не удалось сохранить комментарий в базе данных");
    }
    await commentsRepository.createUserCommentRelation(userId, newComment.id);
    const fullComment = await commentsRepository.getCommentWithAuthor(
      newComment.id,
    );
    if (!fullComment) {
      throw new ApiError(500, "Ошибка при сборке данных комментария");
    }
    return fullComment;
  },

  async editComment(commentId: number, text: string, userId: number) {
    const relation = await commentsRepository.getCommentRelation(commentId);
    if (!relation) throw new ApiError(404, "Комментарий не найден");
    if (relation.userId !== userId)
      throw new ApiError(
        403,
        "Доступ запрещен: вы не являетесь автором этого комментария",
      );

    const updated = await commentsRepository.updateCommentText(commentId, text);
    if (!updated) throw new ApiError(500, "Не удалось обновить комментарий");

    const fullComment =
      await commentsRepository.getCommentWithAuthor(commentId);
    if (!fullComment)
      throw new ApiError(500, "Ошибка при сборке данных комментария");

    return fullComment;
  },

  async removeComment(commentId: number, userId: number) {
    const relation = await commentsRepository.getCommentRelation(commentId);
    if (!relation) throw new ApiError(404, "Комментарий не найден");
    if (relation.userId !== userId)
      throw new ApiError(
        403,
        "Доступ запрещен: вы не являетесь автором этого комментария",
      );

    await commentsRepository.deleteComment(commentId);
  },

  async toggleLike(olid: string, userId: number) {
    const isLiked = await likesRepository.checkIsLiked(olid, userId);

    if (isLiked) {
      await likesRepository.removeLike(olid, userId);
    } else {
      await likesRepository.addLike(olid, userId);
    }

    const newLikesCount = await likesRepository.getLikesCount(olid);

    wsService.broadcastLikesUpdate(olid, newLikesCount);

    return { is_liked: !isLiked, likes_count: newLikesCount };
  },
};
