import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const booksCache = pgTable("books_cache", {
  olid: varchar("olid", { length: 50 }).primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  author: varchar("author", { length: 500 }).notNull(),
  coverUrl: varchar("cover_url", { length: 500 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BookCacheEntry = typeof booksCache.$inferSelect;
export type NewBookCacheEntry = typeof booksCache.$inferInsert;
