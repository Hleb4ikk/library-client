import type { Request, Response } from "express";
import { booksService } from "@/services/books.service.js";
import { likesRepository } from "@/repositories/likes.repository.js";
import ApiError from "@/classes/ApiError.js";

export async function search(req: Request, res: Response) {
  try {
    const validatedQuery = req.query as any;
    const result = await booksService.searchBooks({
      q: validatedQuery.q,
      title: validatedQuery.title,
      author: validatedQuery.author,
      page: validatedQuery.page,
    });

    const olids: string[] = result.books
      .map((book: any) => book.olid)
      .filter((olid: any): olid is string => Boolean(olid));

    const [likesCounts, likedOlids] = await Promise.all([
      likesRepository.getLikesCountsForOlids(olids),
      req.userId
        ? likesRepository.getUserLikedOlids(req.userId, olids)
        : Promise.resolve(new Set<string>()),
    ]);

    const books = result.books.map((book: any) => ({
      ...book,
      likes_count: book.olid ? (likesCounts.get(book.olid) ?? 0) : 0,
      is_liked: book.olid ? likedOlids.has(book.olid) : false,
    }));

    return res.status(200).json({
      success: true,
      message: "Книги успешно найдены",
      data: {
        books,
        total_results: result.total_results,
        page: validatedQuery.page,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при поиске книг");
  }
}

export async function getDetails(req: Request, res: Response) {
  try {
    const olid = String(req.params.olid);
    const currentUserId = req.userId ?? null;

    const details = await booksService.getBookDetails(olid, currentUserId);
    return res.status(200).json({
      success: true,
      message: "Информация о книге успешно получена",
      data: details,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при получении информации о книге");
  }
}

export async function getComments(req: Request, res: Response) {
  try {
    const olid = String(req.params.olid);
    const page = req.query.page ? Number(req.query.page) : 1;

    const result = await booksService.getBookComments(olid, page);

    return res.status(200).json({
      success: true,
      message: "Комментарии успешно получены",
      data: { ...result, page },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при получении комментариев");
  }
}

export async function createComment(req: Request, res: Response) {
  try {
    const olid = String(req.params.olid);
    const text = String(req.body.text);
    const currentUserId = req.userId!;

    const comment = await booksService.addComment(olid, text, currentUserId);

    return res.status(201).json({
      success: true,
      message: "Комментарий успешно добавлен",
      data: comment,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при добавлении комментария");
  }
}

export async function updateComment(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const text = String(req.body.text);
    const currentUserId = req.userId!;

    const updated = await booksService.editComment(id, text, currentUserId);

    return res.status(200).json({
      success: true,
      message: "Комментарий успешно обновлен",
      data: updated,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при обновлении комментария");
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const currentUserId = req.userId!;

    await booksService.removeComment(id, currentUserId);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при удалении комментария");
  }
}

export async function toggleBookLike(req: Request, res: Response) {
  try {
    const OlsonId = String(req.params.olid);
    const currentUserId = req.userId!;

    const result = await booksService.toggleLike(OlsonId, currentUserId);

    return res.status(200).json({
      success: true,
      message: "Статус лайка изменен",
      data: result,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Ошибка при обработке лайка");
  }
}
