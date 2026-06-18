import type { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { db } from '../database/db.js';
import { users } from '../database/schemas/users.js';
import { comments } from '../database/schemas/comments.js';
import { likes } from '../database/schemas/likes.js';
import { usersToComments } from '../database/schemas/usersToComments.js';
import { eq, and, sql, desc } from 'drizzle-orm';
import ApiError from '../classes/ApiError.js';
import {
  searchBooksSchema,
  getBookDetailsSchema,
  getBookCommentsSchema
} from '../schemas/books.schema.js';

const OPEN_LIBRARY_URL = 'https://openlibrary.org';

export const booksController = {

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = searchBooksSchema.parse({ query: req.query });
      const { q, title, author, page } = validated.query;

      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      if (q) searchParams.append('q', q);
      if (title) searchParams.append('title', title);
      if (author) searchParams.append('author', author);

      const response = await axios.get(`${OPEN_LIBRARY_URL}/search.json`, { 
        params: Object.fromEntries(searchParams) 
      });
      
      const docs = response.data.docs || [];
      const formattedBooks = docs.map((book: any) => ({
        olid: book.key ? book.key.replace('/works/', '') : null,
        title: book.title,
        author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
        cover_edition_key: book.cover_edition_key || null,
        cover_url: book.cover_edition_key ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg` : null,
      }));

      return res.status(200).json({ books: formattedBooks, total_results: response.data.numFound || 0, page });
    } catch (error) {
      next(error);
    }
  },

  async getDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = getBookDetailsSchema.parse({ params: req.params });
      const { olid } = validated.params;

      const currentUserId = (req as any).user?.id || null; 

      const [apiResponse, dbLikes, dbComments] = await Promise.all([
        axios.get(`${OPEN_LIBRARY_URL}/works/${olid}.json`).catch(() => null),
        db.select({ count: sql<number>`count(*)` }).from(likes).where(eq(likes.bookOlid, olid)),
        db.select({ count: sql<number>`count(*)` }).from(comments).where(eq(comments.bookOlid, olid))
      ]);

      if (!apiResponse) {
        throw new ApiError(404, 'Book not found in Open Library');
      }

      const data = apiResponse.data;
      let description = '';
      if (typeof data.description === 'string') {
        description = data.description;
      } else if (data.description && data.description.value) {
        description = data.description.value;
      }

      let isLikedByMe = false;
      if (currentUserId) {
        const userLike = await db
          .select()
          .from(likes)
          .where(and(eq(likes.bookOlid, olid), eq(likes.userId, currentUserId)))
          .limit(1);
        isLikedByMe = userLike.length > 0;
      }

      return res.status(200).json({
        olid,
        title: data.title,
        description: description || 'No description available.',
        covers: data.covers || [],
        cover_url: data.covers && data.covers.length > 0 ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : null,
        likes_count: Number(dbLikes[0]?.count || 0),
        comments_count: Number(dbComments[0]?.count || 0),
        is_liked: isLikedByMe
      });
    } catch (error) {
      next(error);
    }
  },

  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = getBookCommentsSchema.parse({ params: req.params, query: req.query });
      const { olid } = validated.params;
      const { page } = validated.query;

      const limit = 10;
      const offset = (page - 1) * limit;

      const [bookComments, totalCommentsResult] = await Promise.all([
        db
          .select({
            id: comments.id,
            text: comments.text,
            createdAt: comments.createdAt,
            user: {
              id: users.id,
              username: users.username
            }
          })
          .from(comments)
          .leftJoin(usersToComments, eq(usersToComments.commentId, comments.id))
          .leftJoin(users, eq(users.id, usersToComments.userId))
          .where(eq(comments.bookOlid, olid))
          .orderBy(desc(comments.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(comments).where(eq(comments.bookOlid, olid))
      ]);

      return res.status(200).json({
        comments: bookComments,
        total_results: Number(totalCommentsResult[0]?.count || 0),
        limit,
        page
      });
    } catch (error) {
      next(error);
    }
  }
};