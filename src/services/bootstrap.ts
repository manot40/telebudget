import type { User } from 'grammy/types';

import { user$ } from '~/db/schema';

export async function registerUser(user: User) {
  const username = user.username || null;
  const fullname = [user.first_name, user.last_name].filter(Boolean).join(' ');

  const [dbUser] = await db
    .insert(user$)
    .values({ teleId: user.id, username, fullname })
    .onConflictDoUpdate({ set: { username, fullname }, target: user$.teleId })
    .returning();

  return dbUser;
}
