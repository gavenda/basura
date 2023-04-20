import { findCharacterNames } from '@anilist/character.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

export class Character implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(ctx: SlashCommandContext): Promise<void> {
    await ctx.edit(`Not supported yet!`);
  }

  async handleAutocomplete(ctx: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const query = ctx.getStringOption(`query`).value;
    const names = await findCharacterNames(query);

    return names.map((x) => {
      return {
        name: x,
        value: x,
      };
    });
  }
}
