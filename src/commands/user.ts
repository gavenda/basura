import { findUserName } from '@anilist/user.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

export class User implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(ctx: SlashCommandContext): Promise<void> {
    ctx.edit(`Not supported yet!`);
  }

  async handleAutocomplete(ctx: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const query = ctx.getStringOption(`query`).value;
    const names = await findUserName(query);

    return names.map((x) => {
      return {
        name: x,
        value: x,
      };
    });
  }
}
