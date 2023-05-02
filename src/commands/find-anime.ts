import { MediaType } from '@anilist/gql/types.js';
import { findMediaTitles } from '@anilist/media.js';
import { CommandHandler, handlePaginatorComponents } from '@studio-bogus/discord-interaction-app';
import { AutocompleteContext, ComponentContext, SlashCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { handleFindMedia } from './find.js';

export class FindAnimeCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    const query = context.getRequiredString(`query`);
    await handleFindMedia(context, query, MediaType.ANIME);
  }

  async handleAutocomplete(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const query = context.getRequiredString(`query`);
    const titles = await findMediaTitles(query, MediaType.ANIME);

    return titles.map((x) => {
      return {
        name: x,
        value: x,
      };
    });
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
