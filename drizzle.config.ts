import type { Config } from 'drizzle-kit';

export default {
  out: './drizzle',
  driver: 'better-sqlite',
  schema: './src/db/schema.ts',
  dbCredentials: { url: '.data/sqlite.db' },
} satisfies Config;
