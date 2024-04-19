import type { UserSetting } from '~/types/user';

import { relations } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

import { tag$ } from './tag';
import { transaction$ } from './transaction';

import { cuid, timestamp } from '../helper';

export const user$ = sqliteTable('tlb_users', {
  id: cuid('id').primaryKey(),
  teleId: integer('telegram_id').unique('user_tele_id').notNull(),
  settings: text('settings', { mode: 'json' }).default('{}').$type<UserSetting>().notNull(),
  fullname: text('fullname').notNull(),
  username: text('username'),
  ...timestamp(),
});

export const userRelations = relations(user$, ({ many }) => ({
  tags: many(tag$),
  transactions: many(transaction$),
}));

export type User = typeof user$.$inferSelect;
export type UserDML = typeof user$.$inferInsert;
