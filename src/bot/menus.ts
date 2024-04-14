import { Menu } from '@grammyjs/menu';

import { and, eq } from 'drizzle-orm';
import { transaction$ } from '~/db/schema';

import { parseTransaction } from '~/services/transaction';

export const confirmEdit = new Menu<BotContext>('confirm-edit-menu')
  .text('Yes', async (ctx) => {
    ctx.menu.close();
    const msg = ctx.session.cachedChat;
    const user = ctx.session.user;
    if (!msg) return ctx.editMessageText('Failed to update. Transaction expired');

    const { values, error } = await parseTransaction(msg, user, { mode: 'overwrite' });
    if (!values || error) return ctx.reply(error);

    try {
      await db
        .update(transaction$)
        .set({ ...values, updatedAt: new Date() })
        .where(and(eq(transaction$.userId, user.id), eq(transaction$.chatId, msg.message_id)));
      ctx.editMessageText('Transaction updated successfully');
    } catch (e) {
      console.error(e);
      ctx.editMessageText('Failed to update. Unknown Error');
    } finally {
      ctx.session.cachedChat = null;
    }
  })
  .text('No', (ctx) => {
    ctx.deleteMessage();
    ctx.session.cachedChat = null;
  });
