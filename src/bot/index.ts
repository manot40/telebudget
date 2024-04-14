import { Bot, webhookCallback } from 'grammy';

const TOKEN = import.meta.env.TELEBOT_TOKEN;
if (!TOKEN) throw new Error('$TELEBOT_TOKEN is not set');

export const bot = new Bot<BotContext>(TOKEN);

export const useWebhook = webhookCallback(bot, 'hono');
export default bot;
