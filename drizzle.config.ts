import type { Config } from 'drizzle-kit';

export default {
  out: './drizzle',
  driver: 'libsql',
  schema: './src/db/schema.ts',
  dbCredentials: { url: 'file:.data/sqlite.db' },
} satisfies Config;
