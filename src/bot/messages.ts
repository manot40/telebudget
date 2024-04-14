import loadMarkdown from '~/utils/load-markdown';
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
  return ctx.reply(CONFIRM_EDIT, { reply_markup: confirmEdit });
});

const CONFIRM_EDIT = await loadMarkdown('confirm-edit');
