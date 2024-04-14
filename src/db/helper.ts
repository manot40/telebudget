import { createId } from '@paralleldrive/cuid2';

import { text, integer } from 'drizzle-orm/sqlite-core';

export const cuid = <T extends string>(key: T) => text(key).$defaultFn(() => createId());

export const timestamp = () => ({
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});
