import bot from '.';
import { session } from 'grammy';

import * as Menus from './menus';

import { registerUser } from '~/services/bootstrap';

bot.use(session({ initial: () => ({}) }), async (ctx, next) => {
  if (!ctx.from) return ctx.reply('User not found');
  ctx.session.user = await registerUser(ctx.from);
  return next();
});

bot.use(...Object.values(Menus));
