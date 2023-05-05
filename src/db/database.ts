import { GuildTable, UserTable } from './tables.js';

export interface Database {
  anilist_user: UserTable;
  anilist_guild: GuildTable;
}
