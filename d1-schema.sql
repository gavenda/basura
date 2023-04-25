DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS guild;
DROP TABLE IF EXISTS user_locale;
DROP TABLE IF EXISTS anime_airing_schedule;
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id BIGINT NOT NULL,
  discord_guild_id BIGINT NOT NULL,
  anilist_id BIGINT NOT NULL,
  anilist_username VARCHAR(255) NOT NULL,
  UNIQUE(discord_id, discord_guild_id, anilist_id)
);
CREATE TABLE guild (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_guild_id BIGINT NOT NULL,
  hentai BOOLEAN NOT NULL DEFAULT false,
  locale VARCHAR(20) NOT NULL DEFAULT 'en-US',
  notification_channel_id BIGINT NOT NULL DEFAULT -1
);
CREATE TABLE user_locale (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id BIGINT NOT NULL,
  locale VARCHAR(20) NOT NULL DEFAULT 'en-US',
  UNIQUE(discord_id)
);
CREATE TABLE anime_airing_schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_guild_id BIGINT NOT NULL,
  media_id BIGINT NOT NULL,
  discord_user_id BIGINT NOT NULL
);
