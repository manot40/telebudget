import type { User } from 'grammy/types';

import { eq } from 'drizzle-orm';
import { user$ } from '~/db/schema';

export async function registerUser(user: User) {
  const username = user.username || null;
  const fullname = [user.first_name, user.last_name].filter(Boolean).join(' ');

  const userData = await db.query.user$.findFirst({ where: eq(user$.teleId, user.id) });
  if (userData) return userData;

  const [dbUser] = await db.insert(user$).values({ teleId: user.id, username, fullname }).returning();
  return dbUser;
}
