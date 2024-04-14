import * as schema from './schema';

import { Database } from 'bun:sqlite';
import { drizzle, type BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';

const sqlite = new Database(import.meta.env.DB_FILE || '.data/sqlite.db', { create: true });

declare global {
  var db: BunSQLiteDatabase<typeof schema>;
}

export const db = (global.db ??= drizzle(sqlite, { schema }));
