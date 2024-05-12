import type { User } from '~/db/schema/user';
import type { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core';

import dayjs from 'dayjs';

import { gt, lte } from 'drizzle-orm';

export function getLastClose<T extends SQLiteTableWithColumns<any>>(user: User, table: T) {
  const target = dayjs()
    .set('date', user.settings.closingAt ?? 15)
    .endOf('day');

  const start = target.isAfter(Date.now()) ? target.subtract(1, 'month') : target;
  const end = start.add(1, 'month');
  const sql = [gt(table.createdAt, start.toDate()), lte(table.createdAt, end.toDate())];

  return { start, end, sql };
}
