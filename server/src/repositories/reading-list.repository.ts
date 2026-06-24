import { db } from "../database/db.js";
import { readingList } from "../database/schemas/readingList.js";
import type { ReadingListStatus } from "../database/schemas/readingList.js";
import { eq, and } from "drizzle-orm";

export const readingListRepository = {
  async findBooksByUser(userId: number, status: ReadingListStatus | null, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const items = await db
    .select()
    .from(readingList)
    .where(
      status
      ? and(eq(readingList.userId, userId), eq(readingList.status, status))
      : eq(readingList.userId, userId))
    .offset(offset)
    .limit(limit);
    return items;
  },

  async countBooksByUser(userId: number, status: ReadingListStatus | null) {
    const result = await db
      .select()
      .from(readingList)
      .where(
        status 
          ? and(eq(readingList.userId, userId), eq(readingList.status, status))
          : eq(readingList.userId, userId)
      );
    
    return Number(result?.length || 0);
  },

  async findByUserAndBook(userId: number, bookOlid: string) {
    const [item] = await db
      .select()
      .from(readingList)
      .where(and(eq(readingList.userId, userId), eq(readingList.bookOlid, bookOlid)))
      .limit(1);
    return item;
  },

  async findById(id: number) {
    const [item] = await db.select().from(readingList).where(eq(readingList.id, id)).limit(1);
    return item;
  },

  async create(userId: number, bookOlid: string, status: ReadingListStatus) {
    const [item] = await db
      .insert(readingList)
      .values({ userId, bookOlid, status })
      .returning();
    return item;
  },

  async updateStatus(id: number, status: ReadingListStatus) {
    const [item] = await db
      .update(readingList)
      .set({ status, updatedAt: new Date() })
      .where(eq(readingList.id, id))
      .returning();
    return item;
  },

  async deleteById(id: number) {
    await db.delete(readingList).where(eq(readingList.id, id));
  },
};
