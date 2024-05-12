import type { User } from '~/db/schema/user';

import dayjs from 'dayjs';
import { getLastClose } from '~/utils/query';

import { tag$, transaction$ } from '~/db/schema';
import { and, desc, eq, sum } from 'drizzle-orm';

const numFmt = new Intl.NumberFormat('id', { currency: 'IDR', style: 'currency', maximumFractionDigits: 0 })
  .format;

export async function getQuickSummary(user: User, tx = global.db) {
  const { start, end, sql } = getLastClose(user, transaction$);

  const [expense] = await tx
    .select({ value: sum(transaction$.amount), id: transaction$.id })
    .from(transaction$)
    .where(and(eq(transaction$.userId, user.id), eq(transaction$.type, 'EXPENSE'), ...sql));

  if (!expense.value) return null;
  const daysPassed = start.diff(dayjs(), 'day');
  const average = (+expense.value / daysPassed) * -1;

  return {
    start: start.format('DD-MM-YYYY'),
    end: end.format('DD-MM-YYYY'),
    average: numFmt(average),
    expense: numFmt(+expense.value),
    prediction: numFmt(average * 30),
  };
}

export async function mostSpentTags(user: User, tx = global.db) {
  const { sql } = getLastClose(user, transaction$);

  const tags = await tx
    .select({ tag: tag$.name, value: sum(transaction$.amount) })
    .from(transaction$)
    .where(and(eq(transaction$.userId, user.id), ...sql))
    .groupBy(transaction$.tagId)
    .orderBy(desc(sum(transaction$.amount)))
    .limit(5)
    .leftJoin(tag$, eq(transaction$.tagId, tag$.id));

  return tags.map((v) => ({ tag: v.tag, value: v.value && numFmt(+v.value) }));
}
