import { GuildTable, UserTable } from './tables';

export interface Database {
  anilist_user: UserTable;
  anilist_guild: GuildTable;
}
