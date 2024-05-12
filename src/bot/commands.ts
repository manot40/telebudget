import bot from '.';

// Databases
import { and, eq } from 'drizzle-orm';
import { transaction$ } from '~/db/schema';

// Services
import { getQuickSummary, mostSpentTags } from '~/services/reporting';
import { parseTransaction, transactionExist } from '~/services/transaction';

// Utilities
import loadTemplate from '~/utils/load-template';

bot.command('help', (ctx) => ctx.replyWithHTML(HELP));

bot.command('start', (ctx) => {
  const user = ctx.session.user;
  if (user) return ctx.reply(`Welcome, ${user.fullname}\n\n Type /help to see available commands.`);
});

bot.command(['add', 'a', '@'], async (ctx) => {
  const msg = ctx.message;
  const user = ctx.session.user;
  if (!msg) return ctx.reply(`Invalid format provided.\n\n${HELP_ADD}`);

  const { values, error } = await parseTransaction(msg, user);
  if (!values || error) return ctx.replyWithHTML(`${error}\n\n${HELP_ADD}`);

  try {
    const result = await db.transaction(async (tx) => {
      const [data] = await tx.insert(transaction$).values(values).returning();
      const sum = await getQuickSummary(user, tx);
      return { ...sum, id: data.id };
    });

    const template = await loadTemplate('success-add', result);
    return ctx.replyWithHTML(template);
  } catch (err) {
    console.error(err);
    return ctx.reply('Failed to add transaction');
  }
});

bot.command(['edit', 'e'], async (ctx) => {
  const msg = ctx.message,
    user = ctx.session.user,
    replyMsg = msg?.reply_to_message;

  if (!msg) return ctx.replyWithHTML(`Invalid format provided\n\n${HELP_ADD}`);
  if (!replyMsg) return ctx.reply('Past transaction must be replied to');

  const exist = await transactionExist({ chatId: replyMsg.message_id, userId: user.id });
  if (!exist) return ctx.reply('Transaction not found');

  const { values, error } = await parseTransaction(msg, user);
  if (!values || error) return ctx.replyWithHTML(`${error}\n\n${HELP_ADD}`);
  values.chatId = replyMsg.message_id;

  try {
    await db
      .update(transaction$)
      .set({ ...values, updatedAt: new Date() })
      .where(and(eq(transaction$.userId, user.id), eq(transaction$.chatId, replyMsg.message_id)));
    return ctx.reply('Transaction modified successfully');
  } catch (err) {
    console.error(err);
    return ctx.reply('Failed to modify transaction');
  }
});

bot.command(['delete', 'd'], async (ctx) => {
  const msg = ctx.message,
    user = ctx.session.user,
    id = msg?.text.split(' ')[1],
    replyMsg = msg?.reply_to_message;

  if (!replyMsg && !id) return ctx.reply('Either provide transaction id or quote past transaction chat');

  const exist = await transactionExist(id ? { id } : { chatId: replyMsg!.message_id, userId: user.id });
  if (!exist) return ctx.reply('Transaction not found');

  try {
    await db
      .delete(transaction$)
      .where(id ? eq(transaction$.id, id) : eq(transaction$.chatId, replyMsg!.message_id));

    if (replyMsg)
      await Promise.allSettled([
        ctx.api.deleteMessage(ctx.chat.id, replyMsg.message_id),
        ctx.api.editMessageText(
          ctx.chat.id,
          replyMsg.message_id + 1,
          `Transaction has been deleted\nwas: \`${replyMsg.text}\``,
          { parse_mode: 'MarkdownV2' }
        ),
      ]);

    return ctx.reply('Transaction deleted');
  } catch (err) {
    console.error(err);
    return ctx.reply('Failed to delete transaction');
  }
});

bot.command(['sum', 'summary'], async (ctx) => {
  const report = await getQuickSummary(ctx.session.user);
  if (report === null) return ctx.reply('No expense found');
  const tags = await mostSpentTags(ctx.session.user);

  const template = [await loadTemplate('success-add', report), await loadTemplate('trx-by-tags', { tags })]
    .join('\n\n')
    .trim();

  return ctx.replyWithHTML(template);
});

const HELP = await loadTemplate('help');
const HELP_ADD = await loadTemplate('help-add');
