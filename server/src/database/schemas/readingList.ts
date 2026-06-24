import { pgTable, serial, integer, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const readingListStatuses = [
  'Хочу прочитать',
  'Читаю сейчас',
  'Прочитано',
] as const;

export type ReadingListStatus = (typeof readingListStatuses)[number];

export const readingList = pgTable('reading_list', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bookOlid: varchar('book_olid', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
}, (table) => ({
  userBookUniqueIdx: uniqueIndex('reading_list_user_book_unique_idx').on(table.userId, table.bookOlid),
}));

export type ReadingListItem = typeof readingList.$inferSelect;
export type NewReadingListItem = typeof readingList.$inferInsert;
