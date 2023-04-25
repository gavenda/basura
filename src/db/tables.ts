import { Generated } from 'kysely';

export interface UserTable {
  id: Generated<number>;
  discord_id: number;
  discord_guild_id: number;
  anilist_id: number;
  anilist_username: string;
}
