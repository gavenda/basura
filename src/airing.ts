import { AiringSchedule, MediaStatus } from '@anilist/gql/types.js';
import { findAiringMedia } from '@anilist/media.js';
import { Client } from '@client/client.js';
import { RedisBucketManager } from '@client/redis-bucket-manager.js';
import { Redis } from '@upstash/redis/cloudflare';
import { APIUser, RESTPostAPIWebhookWithTokenJSONBody, Routes } from 'discord-api-types/v10';
import { Env } from './env.js';

interface AnnounceOptions {
  redis: Redis;
  client: Client;
  mediaId: number;
  guildIds: number[];
  airingSchedule: AiringSchedule;
}

export const announceAiringMedia = async (options: AnnounceOptions): Promise<void> => {
  // Retrieve bot avatar
  const user = await options.client.get<APIUser>(Routes.user());
  const selfAvatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;

  for (const guildId of options.guildIds) {
    const webhookKey = `notification:anime-airing:webhook:${guildId}`;
    const webhookData = await options.redis.hgetall<Record<string, string>>(webhookKey);
    const requestKey = `notification:anime-airing:request:${guildId}:${options.mediaId}`;
    const requester = await options.redis.get<string>(requestKey);

    if (webhookData) {
      const mediaTitle = options.airingSchedule.media?.title?.english ?? options.airingSchedule.media?.title?.romaji ?? 'Unknown';

      const body: RESTPostAPIWebhookWithTokenJSONBody = {
        username: user.username,
        avatar_url: selfAvatarUrl,
        embeds: [
          {
            author: {
              name: `New Episode Aired`,
            },
            color: 16711680,
            thumbnail: {
              url: options.airingSchedule.media?.coverImage?.extraLarge ?? '',
            },
            description: `:bell: Episode **${options.airingSchedule.episode}** of **${mediaTitle}** has aired.`,
            fields: [
              {
                name: 'Requested By',
                value: `<${requester}>`,
              },
            ],
          },
        ],
      };

      await options.client.post(Routes.webhook(webhookData.id.substring(1), webhookData.token), {
        body,
      });
    }
  }
};

export const removeAiringAnimeData = async (redis: Redis, guildIds: number[], mediaId: number): Promise<void> => {
  const mediaKey = `notification:anime-airing:media:${mediaId}`;

  const deletedKeys: string[] = [mediaKey];

  for (const guildId of guildIds) {
    const requestKey = `notification:anime-airing:request:${guildId}:${mediaId}`;
    const guildKey = `notification:anime-airing:guild:${guildId}`;

    // Remove from media id set
    await redis.srem(guildKey, mediaId);
    deletedKeys.push(requestKey);
  }

  // Remove data
  await redis.del(...deletedKeys);
};

export const checkAiringAnimes = async (environment: Env): Promise<void> => {
  const notificationKey = `notification:anime-airing`;
  const redis = Redis.fromEnv(environment);
  const guildIds = await redis.smembers<number[]>(notificationKey);
  const guildKeys = guildIds.map((guildId) => `notification:anime-airing:guild:${guildId}`);
  const bucketManager = new RedisBucketManager(redis);
  const client = new Client({ bucketManager }).setToken(environment.DISCORD_TOKEN);

  if (guildKeys.length <= 0) {
    return;
  }

  const mediaIds = (await redis.sunion(guildKeys[0], ...guildKeys)) as number[];

  for (const mediaId of mediaIds) {
    const mediaKey = `notification:anime-airing:media:${mediaId}`;
    const episode = (await redis.get<number>(mediaKey)) || 0;
    const airingSchedules = await findAiringMedia(mediaId);
    const airingSchedule = airingSchedules?.[0];

    if (airingSchedule && airingSchedule.episode > episode) {
      // Announce to guilds
      await announceAiringMedia({
        redis,
        client,
        mediaId,
        guildIds,
        airingSchedule,
      });
      // Update episode count
      await redis.set(mediaKey, airingSchedule.episode);
      // Check if ended
      if (airingSchedule.media?.status === MediaStatus.Finished) {
        await removeAiringAnimeData(redis, guildIds, mediaId);
      }
    }
  }
};
