import '~/bot/menus';
import '~/bot/middlewares';
import '~/bot/commands';
import '~/bot/messages';

import bot, { useWebhook } from '~/bot';

const MODE = (import.meta.env.MODE?.toLowerCase() || 'pull') as 'pull' | 'webhook';

if (MODE === 'webhook') {
  const { Hono } = await import('hono/tiny');
  const { logger } = await import('hono/logger');

  const app = new Hono()
    .use(logger())
    .use(useWebhook)
    .onError((e, ctx) => {
      const error = e.message;
      if (error !== 'Unexpected end of JSON input') console.error(e.message);
      return ctx.json({ error }, 500);
    });

  Bun.serve({ port: import.meta.env.PORT || 8000, fetch: app.fetch });
} else {
  bot.catch((e) => console.error(e));
  bot.start();
}
