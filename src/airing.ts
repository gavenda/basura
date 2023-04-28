import { AiringSchedule, MediaStatus } from '@anilist/gql/types.js';
import { findAiringMedia } from '@anilist/media.js';
import { Client } from '@client/client.js';
import { APIUser, RESTPostAPIWebhookWithTokenJSONBody, Routes } from 'discord-api-types/v10';
import { Env, KVWebhook } from './env.js';
import { KVBucketManager } from '@client/kv-bucket-manager.js';

interface AnnounceOptions {
  kv: KVNamespace;
  client: Client;
  mediaId: number;
  guildIds: Set<number>;
  airingSchedule: AiringSchedule;
}

export const announceAiringMedia = async (options: AnnounceOptions): Promise<void> => {
  // Retrieve bot avatar
  const user = await options.client.get<APIUser>(Routes.user());
  const selfAvatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;

  for (const guildId of options.guildIds) {
    const webhookKey = `notification:anime-airing:webhook:${guildId}`;
    const webhookData = await options.kv.get<KVWebhook>(webhookKey, 'json');
    const requestKey = `notification:anime-airing:request:${guildId}:${options.mediaId}`;
    const requester = await options.kv.get(requestKey, 'text');

    if (requester && webhookData) {
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
                value: `<@${requester}>`,
              },
            ],
          },
        ],
      };

      const query = new URLSearchParams();

      if (webhookData.threadId) {
        query.set(`thread_id`, webhookData.threadId);
      }

      await options.client.post(Routes.webhook(webhookData.id, webhookData.token), {
        body,
        query,
      });
    }
  }
};

export const removeAiringAnimeData = async (kv: KVNamespace, guildIds: Set<number>, mediaId: number): Promise<void> => {
  const mediaKey = `notification:anime-airing:media:${mediaId}`;

  // Delete media key
  await kv.delete(mediaKey);

  for (const guildId of guildIds) {
    const requestKey = `notification:anime-airing:request:${guildId}:${mediaId}`;
    const guildKey = `notification:anime-airing:guild:${guildId}`;

    const mediaIds = new Set(await kv.get<number[]>(guildKey, 'json') || []);

    mediaIds.delete(mediaId);

    // Remove from media id set
    await kv.put(guildKey, JSON.stringify([...mediaIds]));
    await kv.delete(requestKey);
  }
};

export const checkAiringAnimes = async (environment: Env): Promise<void> => {
  const notificationKey = `notification:anime-airing`;
  const kv = environment.NOTIFICATION;
  const guildIdsArr = await kv.get<number[]>(notificationKey) || [];
  const guildIds = new Set(guildIdsArr);
  const guildKeys = guildIdsArr.map((guildId) => `notification:anime-airing:guild:${guildId}`);
  const bucketManager = new KVBucketManager(environment.BUCKET);
  const client = new Client({ bucketManager }).setToken(environment.DISCORD_TOKEN);

  if (guildKeys.length <= 0) {
    return;
  }

  const mediaIds = new Set<number>();

  // Manual union, using without redis
  for (const guildKey of guildKeys) {
    const guildMediaIds = await kv.get<number[]>(guildKey) || [];
    for (const mediaId of guildMediaIds) {
      mediaIds.add(mediaId);
    }
  }

  for (const mediaId of mediaIds) {
    const mediaKey = `notification:anime-airing:media:${mediaId}`;
    const episode = Number(await kv.get(mediaKey, 'text') || '0');
    const airingSchedules = await findAiringMedia(mediaId);
    const airingSchedule = airingSchedules?.[0];

    if (airingSchedule && airingSchedule.episode > episode) {
      // Announce to guilds
      await announceAiringMedia({
        kv,
        client,
        mediaId,
        guildIds,
        airingSchedule,
      });
      // Update episode count
      await kv.put(mediaKey, airingSchedule.episode.toString());
      // Check if ended
      if (airingSchedule.media?.status === MediaStatus.Finished) {
        await removeAiringAnimeData(kv, guildIds, mediaId);
      }
    }
  }
};
