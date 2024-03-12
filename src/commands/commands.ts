import { CommandMap } from '@studio-bogus/discord-interaction-app';
import { AboutCommand } from './about';
import { BindCommand } from './bind';
import { CharacterCommand } from './character';
import { FindCommand } from './find';
import { FindAnimeCommand } from './find-anime';
import { FindMangaCommand } from './find-manga';
import { LinkCommand } from './link';
import { FindAnimeMessageCommand } from './message/anime';
import { FindCharacterMessageCommand } from './message/character';
import { FindMangaMessageCommand } from './message/manga';
import { FindStaffMessageCommand } from './message/staff';
import { NotificationCommand } from './notification';
import { RankingCommand } from './ranking';
import { StaffCommand } from './staff';
import { UnbindCommand } from './unbind';
import { UnlinkCommand } from './unlink';
import { UserCommand } from './user';
import { FindUserCommand } from './user/user';

export const commands: CommandMap = {
  'about': new AboutCommand(),
  'find': new FindCommand(),
  'anime': new FindAnimeCommand(),
  'manga': new FindMangaCommand(),
  'staff': new StaffCommand(),
  'user': new UserCommand(),
  'link': new LinkCommand(),
  'unlink': new UnlinkCommand(),
  'character': new CharacterCommand(),
  'ranking': new RankingCommand(),
  'notification': new NotificationCommand(),
  'bind': new BindCommand(),
  'unbind': new UnbindCommand(),
  'Search Anime': new FindAnimeMessageCommand(),
  'Search Manga': new FindMangaMessageCommand(),
  'Search Character': new FindCharacterMessageCommand(),
  'Search Staff': new FindStaffMessageCommand(),
  'Show AniList User': new FindUserCommand()
};
