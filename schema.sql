CREATE TABLE user (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	discord_id BIGINT NOT NULL,
	discord_guild_id BIGINT NOT NULL,
	anilist_id BIGINT NOT NULL,
	anilist_username VARCHAR(255) NOT NULL,
	UNIQUE(discord_id, discord_guild_id, anilist_id)
);
CREATE TABLE guild (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	discord_guild_id BIGINT NOT NULL,
	hentai BOOLEAN NOT NULL DEFAULT false,
	locale VARCHAR(20) NOT NULL DEFAULT 'en-US',
	notification_channel_id BIGINT NOT NULL DEFAULT -1
);
CREATE TABLE user_locale (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	discord_id BIGINT NOT NULL,
	locale VARCHAR(20) NOT NULL DEFAULT 'en-US',
	UNIQUE(discord_id)
);
CREATE TABLE anime_airing_schedule (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	discord_guild_id BIGINT NOT NULL,
	media_id BIGINT NOT NULL,
	discord_user_id BIGINT NOT NULL
);
