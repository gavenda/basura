import { MediaType } from '@anilist/gql/types.js';
import { findAiringMedia, findMediaIds } from '@anilist/media.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { Env } from '@env/env';
import { Redis } from '@upstash/redis/cloudflare';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

export class NotificationCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;
  async handle(context: SlashCommandContext): Promise<void> {
    if (context.group !== 'airing-anime') {
      await context.edit({
        message: `Unknown command group.`,
      });
      return;
    }

    switch (context.command) {
      case 'add':
        await this.handleAdd(context);
        break;
      case 'remove':
        await this.handleRemove(context);
        break;
      default:
        await context.edit({
          message: `Unknown command.`,
        });
        break;
    }
  }

  async handleAutocomplete(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    if (context.group !== 'airing-anime') {
      return [];
    }

    const query = context.getRequiredString(`media`);
    const medias = await findMediaIds(query, MediaType.ANIME);

    const result: APIApplicationCommandOptionChoice[] = [];

    for (const media of medias) {
      if (media?.title?.native) {
        result.push({
          name: media.title.native,
          value: media.id,
        });
      }
      if (media?.title?.romaji) {
        result.push({
          name: media.title.romaji,
          value: media.id,
        });
      }
      if (media?.title?.english) {
        result.push({
          name: media.title.english,
          value: media.id,
        });
      }
      if (media.synonyms) {
        for (const synonym of media.synonyms) {
          result.push({
            name: synonym,
            value: media.id,
          });
        }
      }
    }

    return result;
  }

  async handleAdd(context: SlashCommandContext): Promise<void> {
    const redis = new Redis({
      url: context.app.env<Env>().UPSTASH_REDIS_REST_URL,
      token: context.app.env<Env>().UPSTASH_REDIS_REST_TOKEN,
    });

    const notificationKey = `notification:anime-airing`;
    const key = `notification:anime-airing:guild:${context.guildId}`;
    const mediaId = context.getInteger('media') || -1;
    const exists = await redis.sismember(key, mediaId);

    if (exists) {
      await context.edit({
        message: `Anime already added to notifications!`,
      });
      return;
    }

    const requestKey = `notification:anime-airing:request:${context.guildId}:${mediaId}`;
    await redis.set(requestKey, `@${context.userId}`);
    await redis.sadd(notificationKey, context.guildId);
    await redis.sadd(key, mediaId);

    // Add current episode count
    const airingSchedules = await findAiringMedia(mediaId);
    const airingSchedule = airingSchedules?.[0];

    if (airingSchedule) {
      const mediaKey = `notification:anime-airing:media:${mediaId}`;
      await redis.set(mediaKey, airingSchedule.episode);
    }

    await context.edit({
      message: `Anime airing notification added!`,
    });
  }

  async handleRemove(context: SlashCommandContext): Promise<void> {
    const redis = new Redis({
      url: context.app.env<Env>().UPSTASH_REDIS_REST_URL,
      token: context.app.env<Env>().UPSTASH_REDIS_REST_TOKEN,
    });

    const key = `notification:anime-airing:guild:${context.guildId}`;
    const mediaId = context.getInteger('media') || -1;
    const exists = await redis.sismember(key, mediaId);

    if (!exists) {
      await context.edit({
        message: `Anime is not in the list for airing notifications.`,
      });
      return;
    }

    const requestKey = `notification:anime-airing:request:${context.guildId}:${mediaId}`;
    await redis.del(requestKey);
    await redis.srem(key, mediaId);
    await context.edit({
      message: `Anime airing notification removed!`,
    });
  }
}
