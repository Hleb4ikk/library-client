import ApiError from "@/classes/ApiError.js";
import { likesRepository } from "@/repositories/likes.repository.js";
import { findUserById, findUserByUsername, updateUserPassword, updateUserUsername } from "@/repositories/user.repository.js";
import { comparePassword, hashPassword } from "@/utils/password.utils.js";
import { booksService } from "./books.service.js";
import { commentsRepository } from "@/repositories/comments.repository.js";

export async function getUser(userId: number): Promise<{id: number, username: string, createdAt: Date}> {
    const user = await findUserById(userId);
    if (!user) {
        throw new ApiError(404, 'Пользователь не найден');
    }

    return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
    }
}

export async function updateUsername(userId: number, newUsername: string): Promise<{id: number, username: string, createdAt: Date}> {
    const existingUser = await findUserByUsername(newUsername);
    if (existingUser) {
        if (existingUser.id === userId) throw new ApiError(409, 'Новый логин совпадает с текущим');
        throw new ApiError(409, 'Логин уже занят другим пользователем');
    }

    const user = await updateUserUsername(userId, newUsername);
    if (!user) {
        throw new ApiError(404, 'Пользователь не найден');
    }

    return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
    }
}

export async function updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const existingUser = await findUserById(userId);
    if (!existingUser) {
        throw new ApiError(404, 'Пользователь не найден');
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, existingUser.passwordHash);
    if (!isCurrentPasswordValid) {
        throw new ApiError(401, 'Введённый текущий пароль неверный');
    }

    const isSameAsCurrent = await comparePassword(newPassword, existingUser.passwordHash);
    if (isSameAsCurrent) {
        throw new ApiError(400, 'Новый пароль совпадает с текущим')
    }

    const newPasswordHash = await hashPassword(newPassword);

    await updateUserPassword(userId, newPasswordHash);
}

export async function getUserLikes(userId: number, page: number, limit: number) {
    const likes = await likesRepository.findLikesByUser(userId, page, limit);
    const total = await likesRepository.countLikesByUser(userId);

    if (total === 0) {
      return {
        likes: [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

    const likesWithDetails = await Promise.all(
        likes.map(async (like) => {
            const bookDetails = await booksService.getBookDetails(like.bookOlid, userId);
            
            return {
              id: like.id,
              book_olid: like.bookOlid,
              created_at: like.createdAt,
              title: bookDetails.title,
              cover: bookDetails.cover_url,
            }
        })
    );
    
    return {
        likes: likesWithDetails,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getUserComments(userId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const comments = await commentsRepository.findCommentsByUserId(userId, offset, limit);
    const total = await commentsRepository.countCommentsByUserId(userId);

    if (total === 0) {
      return {
        comments: [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

    const commentsWithDetails = await Promise.all(
        comments.map(async (comment) => {
            const bookDetails = await booksService.getBookDetails(comment.bookOlid, userId);
            
            return {
              id: comment.id,
              text: comment.text,
              book_olid: comment.bookOlid,
              book_title: bookDetails.title,
              book_cover: bookDetails.cover_url,
              created_at: comment.createdAt,
              updated_at: comment.updatedAt,
            }
        })
    );
    
    return {
        comments: commentsWithDetails,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}