import type { User } from '~/db/schema/user';
import type { Message } from 'grammy/types';

// Database
import { eq, and, count } from 'drizzle-orm';
// Schema
import { transaction$ } from '~/db/schema';

// Utils
import { upsertTag } from './tag';
import { wordsToNumber } from '~/utils/textParser';

type CheckParams =
  | { id: string; chatId?: never; userId?: never }
  | { id?: never; chatId: number; userId: string };

export async function transactionExist(params: CheckParams) {
  const { id, chatId, userId } = params;

  const where = id
    ? eq(transaction$.id, id)
    : and(eq(transaction$.chatId, chatId!), eq(transaction$.userId, userId!));

  const [countResult] = await db.select({ count: count() }).from(transaction$).where(where);

  return countResult.count > 0;
}

interface ParseOptions {
  mode?: 'update' | 'overwrite';
}
export async function parseTransaction(msg: Message, user: User, options?: ParseOptions) {
  if (!msg.text) return { values: null, error: 'Invalid Message' };

  const { mode } = options ?? {};
  const DEFAULT = mode === 'overwrite' ? null : undefined;

  const userId = user.id,
    amount = wordsToNumber(msg.text),
    tagName = msg.text.match(/(tag|t):(\w+)/)?.[2] ?? DEFAULT;

  if (!amount) return { values: null, error: 'Invalid amount provided' };

  try {
    const values = {
      amount,
      userId,
      // @ts-ignore
      type: (msg.text.includes('type:income') ? 'INCOME' : 'EXPENSE') as const,
      note: msg.text.match(/"([^"]+)"/)?.[1].replace(/"/g, '') ?? DEFAULT,
      tagId: (tagName && (await upsertTag(tagName, userId)).id) ?? DEFAULT,
      chatId: msg.message_id,
    };

    return { values, error: null };
  } catch (e) {
    console.error(e);
    return { values: null, error: 'Failed to add transaction' };
  }
}
