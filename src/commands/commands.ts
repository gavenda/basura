import { CommandMap } from '@app/app.js';
import { AboutCommand } from './about.js';
import { FindAnimeCommand } from './find-anime.js';
import { FindMangaCommand } from './find-manga.js';
import { FindCommand } from './find.js';
import { LinkCommand } from './link.js';
import { StaffCommand } from './staff.js';
import { UnlinkCommand } from './unlink.js';
import { UserCommand } from './user.js';
import { CharacterCommand } from './character.js';

export const commands: CommandMap = {
  about: new AboutCommand(),
  find: new FindCommand(),
  anime: new FindAnimeCommand(),
  manga: new FindMangaCommand(),
  staff: new StaffCommand(),
  user: new UserCommand(),
  link: new LinkCommand(),
  unlink: new UnlinkCommand(),
  character: new CharacterCommand(),
};
