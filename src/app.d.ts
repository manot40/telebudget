interface Session {
  user: import('~/db/schema/user').User;
  cachedChat?: import('grammy/types').Message | null;
}

type BotContext = import('grammy').Context & import('grammy').SessionFlavor<Session>;
