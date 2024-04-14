import bot from '.';

// Databases
import db from '~/db';
import { transaction$ } from '~/db/schema';

// Services
import { parseTransaction } from '~/services/transaction';

bot.command('help', async (ctx) => {
  return ctx.reply('Help message');
});

bot.command('start', async (ctx) => {
  const user = ctx.session.user;
  return ctx.reply(`Welcome, ${user.fullname}\n\n Type /help to see available commands.`);
});

bot.command('settings', async (ctx) => {});

bot.command(['add', 'a'], async (ctx) => {
  const msg = ctx.message;
  const user = ctx.session.user;
  if (!msg) return ctx.reply(`Invalid format provided.${ADD_FORMAT}`);

  const { values, error } = await parseTransaction(msg, user);
  if (!values || error) return ctx.reply(error);

  try {
    await db.insert(transaction$).values(values).returning();
    return ctx.reply('Transaction added successfully');
  } catch (err) {
    console.error(err);
    return ctx.reply('Failed to add transaction');
  }
});

/* Invalid Messages */
const ADD_FORMAT = `
**Accepted format**:
/add (alias: /a) <amount> [(tag|t):<name>] [type:<income|expense>] ["<note>"]

**Example**:
/add 5rb
/add 10rb tag:food
/add 5jt type:income t:salary "Received salary from company"
` as const;
