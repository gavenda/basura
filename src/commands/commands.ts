import { CommandMap } from '@app/app.js';
import { About } from './about.js';
import { FindAnime } from './find-anime.js';
import { FindManga } from './find-manga.js';
import { Find } from './find.js';
import { Link } from './link.js';
import { Staff } from './staff.js';
import { Unlink } from './unlink.js';
import { User } from './user.js';

export const commands: CommandMap = {
  about: new About(),
  find: new Find(),
  anime: new FindAnime(),
  manga: new FindManga(),
  staff: new Staff(),
  user: new User(),
  link: new Link(),
  unlink: new Unlink(),
};
