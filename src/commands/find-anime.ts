import { MediaType } from '@anilist/gql/types.js';
import { CommandHandler, handlePaginatorComponents } from '@studio-bogus/discord-interaction-app';
import { AutocompleteContext, ComponentContext, SlashCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { handleFindMedia, handleMediaTitleAutocomplete } from './find.js';

export class FindAnimeCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    const query = context.getRequiredString(`query`);
    await handleFindMedia(context, query, MediaType.ANIME);
  }

  async handleAutocomplete(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    return await handleMediaTitleAutocomplete(context, MediaType.ANIME);
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
