import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  bookOlid: varchar('book_olid', { length: 50 }).notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});