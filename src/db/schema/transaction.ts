import { relations } from 'drizzle-orm';
import { real, text, integer, unique, sqliteTable } from 'drizzle-orm/sqlite-core';

import { tag$ } from './tag';
import { user$ } from './user';

import { cuid, timestamp } from '../helper';

export const transaction$ = sqliteTable(
  'tlb_transactions',
  {
    id: cuid('id').primaryKey(),
    type: text('type', { enum: ['EXPENSE', 'INCOME'] })
      .notNull()
      .default('EXPENSE'),
    note: text('note'),
    tagId: text('tag_id').references(() => tag$.id, { onDelete: 'set null' }),
    chatId: integer('chat_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user$.id, { onDelete: 'cascade' }),
    amount: real('amount').notNull(),
    ...timestamp(),
  },
  (t) => ({ userChat: unique('user_chat').on(t.chatId, t.userId) })
);

export const transactionRelations = relations(transaction$, ({ one }) => ({
  tag: one(tag$, { fields: [transaction$.tagId], references: [tag$.id] }),
  user: one(user$, { fields: [transaction$.userId], references: [user$.id] }),
}));

export type Transaction = typeof transaction$.$inferSelect;
export type TransactionDML = typeof transaction$.$inferInsert;
