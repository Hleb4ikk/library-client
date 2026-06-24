import { pgTable, serial, integer, timestamp, varchar, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const likes = pgTable('likes', {
  id: serial('serial_id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bookOlid: varchar('book_olid', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userBookUniqueIdx: uniqueIndex('user_book_unique_idx').on(table.userId, table.bookOlid),
}));