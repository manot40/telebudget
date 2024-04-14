import type { User } from '~/db/schema/user';

import dayjs from 'dayjs';

import { transaction$ } from '~/db/schema';
import { and, eq, gt, sum } from 'drizzle-orm';

const numFmt = new Intl.NumberFormat('id', { currency: 'IDR', style: 'currency', maximumFractionDigits: 0 })
  .format;

export async function getQuickSummary(user: User, tx = global.db) {
  let lastClosing = dayjs()
    .set('date', user.settings.closingAt ?? 15)
    .endOf('day');

  if (lastClosing.isAfter(Date.now())) lastClosing = lastClosing.subtract(1, 'month');

  const [expense] = await tx
    .select({ value: sum(transaction$.amount), id: transaction$.id })
    .from(transaction$)
    .where(
      and(
        eq(transaction$.userId, user.id),
        eq(transaction$.type, 'EXPENSE'),
        gt(transaction$.createdAt, lastClosing.toDate())
      )
    );

  expense.value &&= numFmt(+expense.value);

  return {
    expense: expense.value,
  };
}
