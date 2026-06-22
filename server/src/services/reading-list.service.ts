import { readingListRepository } from "@/repositories/reading-list.repository.js";
import type { ReadingListStatus } from "@/database/schemas/readingList.js";
import ApiError from "@/classes/ApiError.js";

export const readingListService = {
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
