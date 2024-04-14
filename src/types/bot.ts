import type { Message } from 'grammy/types';
import type { HydrateFlavor } from '@grammyjs/hydrate';
import type { ParseModeFlavor } from '@grammyjs/parse-mode';
import type { Context, SessionFlavor } from 'grammy';

import type { User } from '~/db/schema/user';

declare global {
  interface BotSession {
    user: User;
    cachedChat?: Message | null;
  }
}

export type BotContext = Context & SessionFlavor<BotSession>;
export type BotInstance = ParseModeFlavor<HydrateFlavor<BotContext>>;
