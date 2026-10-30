import { aboutCommand } from './about.command';
import { animeCommand } from './anime.command';
import { characterCommand } from './character.command';
import { mangaCommand } from './manga.command';
import { staffCommand } from './staff.command';

export const chatInputCommands = [aboutCommand, animeCommand, mangaCommand, staffCommand, characterCommand];

/** What gets PUT to Discord's command registration endpoint. */
export const getChatInputCommandData = () => chatInputCommands.map((command) => command.data());
