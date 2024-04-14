import bot from '.';

// Interactive Menus
import { confirmEdit } from './menus';

// Services
import { transactionExist } from '~/services/transaction';

bot.on('edited_message', async (ctx) => {
  const user = ctx.session.user;
  const edited = ctx.editedMessage;
  if (!edited) return;

  const exist = await transactionExist({ chatId: edited.message_id, userId: user.id });
  if (!exist) return;

  ctx.session.cachedChat = edited;
  const msg =
    'You just modified a message containing past transaction.\n\nDo you want to update related transaction?';
  return ctx.reply(msg, { reply_markup: confirmEdit });
});
