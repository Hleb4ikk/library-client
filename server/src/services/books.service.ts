import axios from "axios";
import { booksRepository } from "@/repositories/books.repository.js";
import ApiError from "@/classes/ApiError.js";
import { wsService } from "./ws.service.js";
const OPEN_LIBRARY_URL = 'https://openlibrary.org';

export const booksService = {
  async searchBooks(filters: { q?: string; title?: string; author?: string; page: number }) {
    const searchParams = new URLSearchParams();
    searchParams.append('page', filters.page.toString());
    if (filters.q) searchParams.append('q', filters.q);
    if (filters.title) searchParams.append('title', filters.title);
    if (filters.author) searchParams.append('author', filters.author);

    const response = await axios.get(`${OPEN_LIBRARY_URL}/search.json`, { 
      params: Object.fromEntries(searchParams) 
    });

    const docs = response.data.docs || [];
    const formattedBooks = docs.map((book: any) => ({
      olid: book.key ? book.key.replace('/works/', '') : null,
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Неизвестный автор',
      cover_edition_key: book.cover_edition_key || null,
      cover_url: book.cover_edition_key ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg` : null,
    }));

    return { books: formattedBooks, total_results: response.data.numFound || 0 };
  },

  async getBookDetails(olid: string, currentUserId: number | null) {
    const [apiResponse, likesCount, commentsCount] = await Promise.all([
      axios.get(`${OPEN_LIBRARY_URL}/works/${olid}.json`).catch(() => null),
      booksRepository.getLikesCount(olid),
      booksRepository.getCommentsCount(olid)
    ]);

    if (!apiResponse) throw new ApiError(404, 'Книга не найдена в Open Library');

    const data = apiResponse.data;
    let description = '';
    if (typeof data.description === 'string') description = data.description;
    else if (data.description && data.description.value) description = data.description.value;

    const isLiked = currentUserId ? await booksRepository.checkIsLiked(olid, currentUserId) : false;

    return {
      olid,
      title: data.title,
      description: description || 'Описание отсутствует.',
      covers: data.covers || [],
      cover_url: data.covers && data.covers.length > 0 ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : null,
      likes_count: likesCount,
      comments_count: commentsCount,
      is_liked: isLiked
    };
  },

  async getBookComments(olid: string, page: number) {
    const limit = 10;
    const offset = (page - 1) * limit;

    const [commentsList, totalCount] = await Promise.all([
      booksRepository.getCommentsList(olid, limit, offset),
      booksRepository.getCommentsCount(olid)
    ]);

    return { comments: commentsList, total_results: totalCount, limit };
  },

 async addComment(bookOlid: string, text: string, userId: number) {
    const newComment = await booksRepository.createComment(bookOlid, text);
    if (!newComment) {
      throw new ApiError(500, 'Не удалось сохранить комментарий в базе данных');
    }
    await booksRepository.createUserCommentRelation(userId, newComment.id);
    const fullComment = await booksRepository.getCommentWithAuthor(newComment.id);
    if (!fullComment) {
      throw new ApiError(500, 'Ошибка при сборке данных комментария');
    }
    return fullComment;
  },

  async editComment(commentId: number, text: string, userId: number) {
    const relation = await booksRepository.getCommentRelation(commentId);
    if (!relation) throw new ApiError(404, 'Комментарий не найден');
    if (relation.userId !== userId) throw new ApiError(403, 'Доступ запрещен: вы не являетесь автором этого комментария');

    return booksRepository.updateCommentText(commentId, text);
  },

  async removeComment(commentId: number, userId: number) {
    const relation = await booksRepository.getCommentRelation(commentId);
    if (!relation) throw new ApiError(404, 'Комментарий не найден');
    if (relation.userId !== userId) throw new ApiError(403, 'Доступ запрещен: вы не являетесь автором этого комментария');

    await booksRepository.deleteComment(commentId);
  },

  async toggleLike(olid: string, userId: number) {
    const isLiked = await booksRepository.checkIsLiked(olid, userId);
    
    if (isLiked) {
      await booksRepository.removeLike(olid, userId);
    } else {
      await booksRepository.addLike(olid, userId);
    }

    const newLikesCount = await booksRepository.getLikesCount(olid);

    wsService.broadcastLikesUpdate(olid, newLikesCount);

    return { is_liked: !isLiked, likes_count: newLikesCount };
  }
};