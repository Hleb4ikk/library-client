import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { comments } from './comments.js';

export const usersToComments = pgTable('users_to_comments', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  commentId: integer('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.commentId] }),
}));