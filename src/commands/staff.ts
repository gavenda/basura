import { findStaffByName } from '@anilist/staff.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

export class StaffCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;
  async handle(context: SlashCommandContext): Promise<void> {
    await context.edit({
      message: `Not supported yet!`,
    });
  }

  async handleAutocomplete(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const query = context.getStringOption(`query`).value;
    const names = await findStaffByName(query);

    return names.map((x) => {
      return {
        name: x,
        value: x,
      };
    });
  }
}
