import { db } from "../database/db.js";
import { likes } from "../database/schemas/likes.js";
import { eq, and, sql, inArray } from "drizzle-orm";

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
  },

  async findLikesByUser(userId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const result = await db
      .select()
      .from(likes)
      .where(eq(likes.userId, userId))
      .offset(offset)
      .limit(limit);

    return result;
  },

  async countLikesByUser(userId: number) {
    const result = await db
      .select()
      .from(likes)
      .where(eq(likes.userId, userId));

    return Number(result?.length || 0);
  },

  async getLikesCountsForOlids(olids: string[]) {
    if (olids.length === 0) return new Map<string, number>();

    const results = await db
      .select({
        bookOlid: likes.bookOlid,
        count: sql<number>`count(*)`,
      })
      .from(likes)
      .where(inArray(likes.bookOlid, olids))
      .groupBy(likes.bookOlid);

    return new Map(
      results.map((row) => [row.bookOlid, Number(row.count || 0)]),
    );
  },
};
