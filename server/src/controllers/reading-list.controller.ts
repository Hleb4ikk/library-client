import type { Request, Response } from 'express';
import { readingListService } from '@/services/reading-list.service.js';
import ApiError from "@/classes/ApiError.js";
import type { ReadingListStatus } from '@/database/schemas/readingList.js';

export async function getReadingListItems(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const userId = req.userId!;
    const status = req.query.status as ReadingListStatus ?? null;

    const result = await readingListService.getItems(userId, status, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Список чтения успешно получен',
      data: result
    });
  }
  catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Ошибка при получении списка чтения');
    }
}

export async function upsertReadingListItem(req: Request, res: Response) {
  try {
    const { book_olid, status } = req.body;
    const userId = req.userId!;

    const { item, isCreated } = await readingListService.upsertItem(userId, book_olid, status);

    return res.status(isCreated ? 201 : 200).json({
      success: true,
      message: isCreated ? 'Книга добавлена в список чтения' : 'Статус книги обновлён',
      data: item,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Ошибка при сохранении записи в списке чтения');
  }
}

export async function deleteReadingListItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const userId = req.userId!;

    await readingListService.removeItem(id, userId);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Ошибка при удалении записи из списка чтения');
  }
}
