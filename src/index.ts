import '~/bot/menus';
import '~/bot/middlewares';
import '~/bot/commands';
import '~/bot/messages';

import bot, { useWebhook } from '~/bot';

const MODE = (import.meta.env.MODE?.toLowerCase() || 'pull') as 'pull' | 'webhook';

if (MODE === 'webhook') {
  const { Hono } = await import('hono');
  const app = new Hono().use(useWebhook);
  Bun.serve({ port: import.meta.env.PORT || 8000, fetch: app.fetch });
} else {
  bot.catch((e) => console.error(e));
  bot.start();
}
