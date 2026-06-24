import { db } from "../database/db.js";
import { likes } from "../database/schemas/likes.js";
import { eq, and, sql } from "drizzle-orm";

export const likesRepository = {
  async getLikesCount(olid: string) {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(likes).where(eq(likes.bookOlid, olid));
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
