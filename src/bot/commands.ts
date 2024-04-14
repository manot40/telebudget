import bot from '.';

// Databases
import { and, eq } from 'drizzle-orm';
import { transaction$ } from '~/db/schema';

// Services
import { parseTransaction, transactionExist } from '~/services/transaction';

// Utilities
import loadMarkdown from '~/utils/load-markdown';

bot.command('help', (ctx) => ctx.replyWithMarkdownV2(HELP));

bot.command('start', (ctx) => {
  const user = ctx.session.user;
  if (user) return ctx.reply(`Welcome, ${user.fullname}\n\n Type /help to see available commands.`);
});

bot.command(['add', 'a'], async (ctx) => {
  const msg = ctx.message;
  const user = ctx.session.user;
  if (!msg) return ctx.reply(`Invalid format provided.\n\n${HELP_ADD}`);

  const { values, error } = await parseTransaction(msg, user);
  if (!values || error) return ctx.replyWithMarkdownV2(`${error}\n\n${HELP_ADD}`);

  try {
    await db.insert(transaction$).values(values).returning();
    return ctx.reply('Transaction added successfully');
  } catch (err) {
    console.error(err);
    return ctx.reply('Failed to add transaction');
  }
});

bot.command(['edit', 'e'], async (ctx) => {
  const msg = ctx.message,
    user = ctx.session.user,
    replyMsg = msg?.reply_to_message;

  if (!msg) return ctx.replyWithMarkdownV2(`Invalid format provided\n\n${HELP_ADD}`);
  if (!replyMsg) return ctx.reply('Past transaction must be replied to');

  const exist = await transactionExist({ chatId: replyMsg.message_id, userId: user.id });
  if (!exist) return ctx.reply('Transaction not found');

  const { values, error } = await parseTransaction(msg, user);
  if (!values || error) return ctx.replyWithMarkdownV2(`${error}\n\n${HELP_ADD}`);
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
    return ctx.reply('Transaction deleted successfully');
  } catch (err) {
    console.error(err);
    return ctx.reply('Failed to delete transaction');
  }
});

const HELP = await loadMarkdown('help');
const HELP_ADD = await loadMarkdown('help-add');
