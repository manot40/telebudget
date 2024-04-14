import { relations } from 'drizzle-orm';
import { text, unique, sqliteTable } from 'drizzle-orm/sqlite-core';

import { user$ } from './user';
import { transaction$ } from './transaction';

import { cuid, timestamp } from '../helper';

export const tag$ = sqliteTable(
  'tlb_tags',
  {
    id: cuid('id').primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id').references(() => user$.id, { onDelete: 'cascade' }),
    ...timestamp(),
  },
  (t) => ({ userTag: unique('user_tag').on(t.name, t.userId) })
);

export const tagRelations = relations(tag$, ({ one, many }) => ({
  user: one(user$, { fields: [tag$.userId], references: [user$.id] }),
  transactions: many(transaction$),
}));

export type Tag = typeof tag$.$inferSelect;
export type TagDML = typeof tag$.$inferInsert;
