import { and, eq } from 'drizzle-orm';

import { tag$, type Tag } from '~/db/schema/tag';

export async function upsertTag(name: string, userId: string): Promise<Tag> {
  name = name.toLowerCase();
  let [tag] = await db
    .select()
    .from(tag$)
    .limit(1)
    .where(and(eq(tag$.name, name), eq(tag$.userId, userId)));

  tag ??= (await db.insert(tag$).values({ name, userId }).returning())[0];

  return tag;
}
