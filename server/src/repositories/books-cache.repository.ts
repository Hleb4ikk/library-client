import { db } from "@/database/db.js";
import {
  booksCache,
  type BookCacheEntry,
} from "@/database/schemas/booksCache.js";
import { eq, inArray } from "drizzle-orm";

export type BookMetadata = {
  olid: string;
  title: string;
  author: string;
  cover_url: string | null;
};

export const booksCacheRepository = {
  async findByOlid(olid: string): Promise<BookCacheEntry | undefined> {
    const [entry] = await db
      .select()
      .from(booksCache)
      .where(eq(booksCache.olid, olid))
      .limit(1);
    return entry;
  },

  async findByOlids(olids: string[]): Promise<BookCacheEntry[]> {
    if (olids.length === 0) return [];
    return db
      .select()
      .from(booksCache)
      .where(inArray(booksCache.olid, olids));
  },

  async upsert(metadata: BookMetadata): Promise<BookCacheEntry | undefined> {
    const [entry] = await db
      .insert(booksCache)
      .values({
        olid: metadata.olid,
        title: metadata.title,
        author: metadata.author,
        coverUrl: metadata.cover_url,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: booksCache.olid,
        set: {
          title: metadata.title,
          author: metadata.author,
          coverUrl: metadata.cover_url,
          updatedAt: new Date(),
        },
      })
      .returning();
    return entry;
  },
};
