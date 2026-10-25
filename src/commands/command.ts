import { APIApplicationCommandOptionChoice, APIMessageTopLevelComponent, MessageFlags } from 'discord-api-types/v10';
import { CommandContext } from '../context';
import { isSearchTooShort } from '../utils/strings';

export interface Command {
  /** Flags for the deferred reply, such as Ephemeral. */
  flags?: MessageFlags;
  handle(context: CommandContext): Promise<void>;
  autocomplete?(context: CommandContext): Promise<APIApplicationCommandOptionChoice[]>;
}

/**
 * A command that looks something up on AniList by an `id` option, which autocompletes from a search.
 */
export const lookupCommand = <T>(options: {
  notFound: string;
  find: (id: number, env: Env) => Promise<T | null>;
  render: (item: T, context: CommandContext) => APIMessageTopLevelComponent[] | Promise<APIMessageTopLevelComponent[]>;
  search: (query: string, env: Env) => Promise<APIApplicationCommandOptionChoice[]>;
}): Command => ({
  async handle(context) {
    const item = await options.find(context.getRequiredNumber('id'), context.env);

    if (!item) {
      await context.reply({ content: options.notFound, flags: MessageFlags.Ephemeral });
      return;
    }

    await context.reply({
      components: await options.render(item, context),
      flags: MessageFlags.IsComponentsV2 | MessageFlags.SuppressNotifications
    });
  },

  // Autocomplete must answer within 3 seconds, so a failed search shows no choices instead of an error.
  async autocomplete(context) {
    const query = context.getString('id');
    if (!query || isSearchTooShort(query)) return [];

    try {
      return await options.search(query, context.env);
    } catch (error) {
      console.error({ message: 'Autocomplete search failed', error });
      return [];
    }
  }
});
