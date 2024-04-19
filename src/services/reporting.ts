import type { User } from '~/db/schema/user';

import dayjs from 'dayjs';

import { transaction$ } from '~/db/schema';
import { and, eq, gt, lte, sum } from 'drizzle-orm';

const numFmt = new Intl.NumberFormat('id', { currency: 'IDR', style: 'currency', maximumFractionDigits: 0 })
  .format;

export async function getQuickSummary(user: User, tx = global.db) {
  let lastClosing = dayjs()
    .set('date', user.settings.closingAt ?? 15)
    .endOf('day');

  if (lastClosing.isAfter(Date.now())) lastClosing = lastClosing.subtract(1, 'month');

  const daysPassed = lastClosing.diff(dayjs(), 'day');

  const [expense] = await tx
    .select({ value: sum(transaction$.amount), id: transaction$.id })
    .from(transaction$)
    .where(
      and(
        eq(transaction$.userId, user.id),
        eq(transaction$.type, 'EXPENSE'),
        gt(transaction$.createdAt, lastClosing.toDate()),
        lte(transaction$.createdAt, lastClosing.add(1, 'month').toDate())
      )
    );

  if (!expense.value) return null;

  const average = (+expense.value / daysPassed) * -1;

  return {
    start: lastClosing.format('DD-MM-YYYY'),
    end: lastClosing.add(1, 'month').format('DD-MM-YYYY'),
    average: numFmt(average),
    expense: numFmt(+expense.value),
    prediction: numFmt(average * 30),
  };
}
