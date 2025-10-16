export interface UserTable {
  id: number;
  discord_id: string;
  discord_guild_id: string;
  anilist_id: number;
  anilist_username: string;
}

export interface GuildTable {
  id: number;
  discord_guild_id: string;
  hentai: boolean;
}
