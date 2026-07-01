import { readingListRepository } from "@/repositories/reading-list.repository.js";
import type { ReadingListStatus } from "@/database/schemas/readingList.js";
import ApiError from "@/classes/ApiError.js";
import { booksService } from "./books.service.js";

export const readingListService = {
  async getItems(
    userId: number,
    status: ReadingListStatus | null,
    page: number,
    limit: number,
    q?: string,
  ) {
    const query = q?.trim();
    if (query) {
      return this.getFilteredItems(userId, status, page, limit, query);
    }

    const items = await readingListRepository.findBooksByUser(userId, status, page, limit);
    const total = await readingListRepository.countBooksByUser(userId, status);

    if (total === 0) {
      return {
        items: [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const bookDetails = await booksService.getBookDetails(item.bookOlid, userId);

        return {
          id: item.id,
          book_olid: item.bookOlid,
          status: item.status as ReadingListStatus,
          created_at: item.createdAt,
          updated_at: item.updatedAt,
          title: bookDetails.title,
          cover: bookDetails.cover_url,
        }
      })
    );

    return {
      items: itemsWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getFilteredItems(
    userId: number,
    status: ReadingListStatus | null,
    page: number,
    limit: number,
    query: string,
  ) {
    const allItems = await readingListRepository.findAllByUser(userId, status);

    const emptyResult = {
      items: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };

    if (allItems.length === 0) {
      return emptyResult;
    }

    const metadataMap = await booksService.ensureBooksCached(
      allItems.map((item) => item.bookOlid),
    );

    const normalizedQuery = query.toLowerCase();
    const filtered = allItems.filter((item) => {
      const metadata = metadataMap.get(item.bookOlid);
      const haystack = [
        item.bookOlid,
        metadata?.title ?? "",
        metadata?.author ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    const items = paginated.map((item) => {
      const metadata = metadataMap.get(item.bookOlid);
      return {
        id: item.id,
        book_olid: item.bookOlid,
        status: item.status as ReadingListStatus,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
        title: metadata?.title ?? item.bookOlid,
        cover: metadata?.cover_url ?? null,
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async upsertItem(userId: number, bookOlid: string, status: ReadingListStatus) {
    const existing = await readingListRepository.findByUserAndBook(userId, bookOlid);

    if (existing) {
      const updated = await readingListRepository.updateStatus(existing.id, status);
      if (!updated) throw new ApiError(500, 'Не удалось обновить статус книги');
      return { item: updated, isCreated: false };
    }

    const created = await readingListRepository.create(userId, bookOlid, status);
    if (!created) throw new ApiError(500, 'Не удалось добавить книгу в список чтения');
    return { item: created, isCreated: true };
  },

  async removeItem(id: number, userId: number) {
    const item = await readingListRepository.findById(id);
    if (!item) throw new ApiError(404, 'Запись не найдена');
    if (item.userId !== userId) throw new ApiError(403, 'Доступ запрещен: вы не являетесь владельцем этой записи');

    await readingListRepository.deleteById(id);
  },
};
