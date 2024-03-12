import { MediaType } from '@anilist/gql/types';
import { CommandHandler, handlePaginatorComponents } from '@studio-bogus/discord-interaction-app';
import {
  AutocompleteContext,
  ComponentContext,
  SlashCommandContext
} from '@studio-bogus/discord-interaction-app/context';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { handleFindMedia, handleMediaTitleAutocomplete } from './find';

export class FindMangaCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    const query = context.getRequiredString(`query`);
    await handleFindMedia(context, query, MediaType.MANGA);
  }

  async handleAutocomplete(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    return await handleMediaTitleAutocomplete(context, MediaType.MANGA);
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
