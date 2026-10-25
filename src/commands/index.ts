import { about } from './about';
import { character } from './character';
import { Command } from './command';
import { anime, manga } from './media';
import { staff } from './staff';

/** Slash command handlers by name. Each one must also be registered in command.list.ts. */
export const commands: Record<string, Command | undefined> = {
  about,
  anime,
  manga,
  staff,
  character
};
