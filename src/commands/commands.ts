import { CommandMap } from '@studio-bogus/discord-interaction-app';
import { AboutCommand } from './about.js';
import { BindCommand } from './bind.js';
import { CharacterCommand } from './character.js';
import { FindAnimeCommand } from './find-anime.js';
import { FindMangaCommand } from './find-manga.js';
import { FindCommand } from './find.js';
import { LinkCommand } from './link.js';
import { FindAnimeMessageCommand } from './message/anime.js';
import { FindCharacterMessageCommand } from './message/character.js';
import { FindMangaMessageCommand } from './message/manga.js';
import { FindStaffMessageCommand } from './message/staff.js';
import { NotificationCommand } from './notification.js';
import { RankingCommand } from './ranking.js';
import { StaffCommand } from './staff.js';
import { UnbindCommand } from './unbind.js';
import { UnlinkCommand } from './unlink.js';
import { UserCommand } from './user.js';
import { FindUserCommand } from './user/user.js';

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
  ranking: new RankingCommand(),
  notification: new NotificationCommand(),
  bind: new BindCommand(),
  unbind: new UnbindCommand(),
  'Search Anime': new FindAnimeMessageCommand(),
  'Search Manga': new FindMangaMessageCommand(),
  'Search Character': new FindCharacterMessageCommand(),
  'Search Staff': new FindStaffMessageCommand(),
  'Show AniList User': new FindUserCommand(),
};
