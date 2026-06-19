import { db } from "../database/db.js";
import { comments } from "../database/schemas/comments.js";
import { usersToComments } from "../database/schemas/usersToComments.js";
import { users } from "../database/schemas/users.js";
import { likes } from "../database/schemas/likes.js";
import { eq, and, sql, desc } from "drizzle-orm";

export const booksRepository = {
  async getLikesCount(olid: string) {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(likes).where(eq(likes.bookOlid, olid));
    return Number(result?.count || 0);
  },

  async getCommentsCount(olid: string) {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(comments).where(eq(comments.bookOlid, olid));
    return Number(result?.count || 0);
  },

  async checkIsLiked(olid: string, userId: number) {
    const result = await db
      .select()
      .from(likes)
      .where(and(eq(likes.bookOlid, olid), eq(likes.userId, userId)))
      .limit(1);
    return result.length > 0;
  },

  async getCommentsList(olid: string, limit: number, offset: number) {
    return db
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
      .offset(offset);
  },

  async createComment(bookOlid: string, text: string) {
    const [newComment] = await db.insert(comments).values({ bookOlid, text }).returning();
    return newComment;
  },

  async createUserCommentRelation(userId: number, commentId: number) {
    await db.insert(usersToComments).values({ userId, commentId });
  },

  async getCommentWithAuthor(commentId: number) {
    const [result] = await db
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
      .where(eq(comments.id, commentId));
    return result;
  },

  async getCommentRelation(commentId: number) {
    const [relation] = await db.select().from(usersToComments).where(eq(usersToComments.commentId, commentId)).limit(1);
    return relation;
  },

  async updateCommentText(commentId: number, text: string) {
    const [updated] = await db.update(comments).set({ text }).where(eq(comments.id, commentId)).returning();
    return updated;
  },

  async deleteComment(commentId: number) {
    await db.delete(comments).where(eq(comments.id, commentId));
  },
  async addLike(bookOlid: string, userId: number) {
    return await db.insert(likes).values({ bookOlid, userId });
  },

  async removeLike(bookOlid: string, userId: number) {
    return await db.delete(likes).where(
      and(
        eq(likes.bookOlid, bookOlid),
        eq(likes.userId, userId)
      )
    );
  }
};