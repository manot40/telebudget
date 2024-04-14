import type { HydrateFlavor } from '@grammyjs/hydrate';
import type { ParseModeFlavor } from '@grammyjs/parse-mode';

export type BotFlavors<T extends BotContext> = ParseModeFlavor<HydrateFlavor<T>>;
