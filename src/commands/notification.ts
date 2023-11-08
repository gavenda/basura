import { MediaType } from '@anilist/gql/types.js';
import { findAiringMedia, findMediaIds } from '@anilist/media.js';
import { Env } from '@env/env';
import { CommandHandler } from '@studio-bogus/discord-interaction-app';
import { AutocompleteContext, SlashCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { truncate } from '@util/strings.js';
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
          name: truncate(media.title.native, 100),
          value: media.id,
        });
      }
      if (media?.title?.romaji) {
        result.push({
          name: truncate(media.title.romaji, 100),
          value: media.id,
        });
      }
      if (media?.title?.english) {
        result.push({
          name: truncate(media.title.english, 100),
          value: media.id,
        });
      }
      if (media.synonyms) {
        for (const synonym of media.synonyms) {
          result.push({
            name: truncate(synonym, 100),
            value: media.id,
          });
        }
      }
    }

    return result;
  }

  async handleAdd(context: SlashCommandContext): Promise<void> {
    const kv = context.app.env<Env>().NOTIFICATION;
    const notificationKey = `notification:anime-airing`;
    const guildKey = `notification:anime-airing:guild:${context.guildId}`;
    const mediaId = context.getInteger('media') || -1;
    const mediaIds = new Set((await kv.get<number[]>(guildKey, 'json')) || []);
    const notificationGuilds = new Set((await kv.get<string[]>(notificationKey, 'json')) || []);

    if (!context.guildId) {
      await context.edit({
        message: `You are not in a discord server.`,
      });
      return;
    }

    const exists = mediaIds.has(mediaId);

    if (exists) {
      await context.edit({
        message: `Anime already added to notifications!`,
      });
      return;
    }

    const requestKey = `notification:anime-airing:request:${context.guildId}:${mediaId}`;

    await kv.put(requestKey, context.userId);
    // add to set
    notificationGuilds.add(context.guildId);
    mediaIds.add(mediaId);

    // update kv
    await kv.put(notificationKey, JSON.stringify([...notificationGuilds]));
    await kv.put(guildKey, JSON.stringify([...mediaIds]));

    // Add current episode count
    const airingSchedules = await findAiringMedia(mediaId);
    const airingSchedule = airingSchedules?.[0];

    if (airingSchedule) {
      const mediaKey = `notification:anime-airing:media:${mediaId}`;
      await kv.put(mediaKey, airingSchedule.episode.toString());
    }

    await context.edit({
      message: `Anime airing notification added!`,
    });
  }

  async handleRemove(context: SlashCommandContext): Promise<void> {
    const kv = context.app.env<Env>().NOTIFICATION;
    const guildKey = `notification:anime-airing:guild:${context.guildId}`;
    const mediaId = context.getInteger('media') || -1;
    const mediaIds = new Set((await kv.get<number[]>(guildKey, 'json')) || []);
    const exists = mediaIds.has(mediaId);

    if (!exists) {
      await context.edit({
        message: `Anime is not in the list for airing notifications.`,
      });
      return;
    }

    const requestKey = `notification:anime-airing:request:${context.guildId}:${mediaId}`;

    await kv.delete(requestKey);
    mediaIds.delete(mediaId);
    await kv.put(guildKey, JSON.stringify([...mediaIds]));

    await context.edit({
      message: `Anime airing notification removed!`,
    });
  }
}
