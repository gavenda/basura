import { MediaType } from '@anilist/anilist.js';
import { findMediaTitles } from '@anilist/media.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

export class FindMangaCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    await context.edit({
      message: `Not supported yet!`,
    });
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
}
