import { findUserName } from '@anilist/user.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

export class UserCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    await context.edit({
      message: `Not supported yet!`,
    });
  }

  async handleAutocomplete(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const username = context.getStringOption(`username`).value;
    const names = await findUserName(username);

    return names.map((x) => {
      return {
        name: x,
        value: x,
      };
    });
  }
}
