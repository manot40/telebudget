import bot from '.';
import { session } from 'grammy';

import { hydrate } from '@grammyjs/hydrate';
import { hydrateReply } from '@grammyjs/parse-mode';

import * as Menus from './menus';

import { registerUser } from '~/services/bootstrap';

bot
  .use(hydrate())
  .use(hydrateReply)
  .use(session({ initial: () => ({}) }), async (ctx, next) => {
    if (!ctx.from) return ctx.reply('User not found');
    ctx.session.user = await registerUser(ctx.from);
    return next();
  })
  .use(...Object.values(Menus));
