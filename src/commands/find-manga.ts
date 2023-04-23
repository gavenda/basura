import { MediaType } from '@anilist/gql/types.js';
import { findMediaTitles } from '@anilist/media.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { ComponentContext } from '@app/context/component-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { handlePaginatorComponents } from '@app/paginator.js';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { handleFindMedia } from './find.js';

export class FindMangaCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    const query = context.getStringOption(`query`).value;
    await handleFindMedia(context, query, MediaType.MANGA);
  }

  async handleAutocomplete(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const query = context.getStringOption(`query`).value;
    const titles = await findMediaTitles(query, MediaType.MANGA);

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
