import { db } from "@/database/db.js";
import { likes } from "@/database/schemas/likes.js";
import {
  readingList,
  type ReadingListStatus,
} from "@/database/schemas/readingList.js";
import { desc, eq } from "drizzle-orm";

export type UserBookSourceType = "likes" | "reading_list" | "all";

export type UserBookSource = {
  bookOlid: string;
  isLiked: boolean;
  readingListStatus: ReadingListStatus | null;
  sortDate: Date;
};

export const userBooksRepository = {
  async findAllUserBooks(
    userId: number,
    type: UserBookSourceType,
  ): Promise<UserBookSource[]> {
    if (type === "likes") {
      const rows = await db
        .select()
        .from(likes)
        .where(eq(likes.userId, userId))
        .orderBy(desc(likes.createdAt));

      return rows.map((row) => ({
        bookOlid: row.bookOlid,
        isLiked: true,
        readingListStatus: null,
        sortDate: row.createdAt,
      }));
    }

    if (type === "reading_list") {
      const rows = await db
        .select()
        .from(readingList)
        .where(eq(readingList.userId, userId))
        .orderBy(desc(readingList.updatedAt), desc(readingList.createdAt));

      return rows.map((row) => ({
        bookOlid: row.bookOlid,
        isLiked: false,
        readingListStatus: row.status as ReadingListStatus,
        sortDate: row.updatedAt ?? row.createdAt,
      }));
    }

    const [likedBooks, readingBooks] = await Promise.all([
      db.select().from(likes).where(eq(likes.userId, userId)),
      db.select().from(readingList).where(eq(readingList.userId, userId)),
    ]);

    const merged = new Map<string, UserBookSource>();

    for (const like of likedBooks) {
      merged.set(like.bookOlid, {
        bookOlid: like.bookOlid,
        isLiked: true,
        readingListStatus: null,
        sortDate: like.createdAt,
      });
    }

    for (const item of readingBooks) {
      const existing = merged.get(item.bookOlid);
      const itemDate = item.updatedAt ?? item.createdAt;

      if (existing) {
        existing.readingListStatus = item.status as ReadingListStatus;
        if (itemDate > existing.sortDate) {
          existing.sortDate = itemDate;
        }
        continue;
      }

      merged.set(item.bookOlid, {
        bookOlid: item.bookOlid,
        isLiked: false,
        readingListStatus: item.status as ReadingListStatus,
        sortDate: itemDate,
      });
    }

    return [...merged.values()].sort(
      (a, b) => b.sortDate.getTime() - a.sortDate.getTime(),
    );
  },
};
