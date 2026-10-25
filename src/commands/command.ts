import { APIApplicationCommandOptionChoice, MessageFlags } from 'discord-api-types/v10';
import { Card, cardToComponents } from '../anilist/card';
import { CommandContext } from '../context';
import { isSearchTooShort } from '../utils/strings';

export interface Command {
  /** Flags for the deferred reply, such as Ephemeral. */
  flags?: MessageFlags;
  handle(context: CommandContext): Promise<void>;
  autocomplete?(context: CommandContext): Promise<APIApplicationCommandOptionChoice[]>;
  /**
   * Handles a click on one of this command's buttons. Their custom_id is `<command name>:<args...>`,
   * and `args` is the part after the name, split on ':'.
   */
  component?(context: CommandContext, args: string[]): Promise<void>;
}

/**
 * A command that looks something up on AniList by an `id` option, which autocompletes from a search.
 * The result is a card whose page buttons re-render it in place.
 */
export const lookupCommand = <T>(options: {
  /** The command's registered name. Page buttons are routed back to it by this name. */
  name: string;
  notFound: string;
  find: (id: number, env: Env) => Promise<T | null>;
  toCard: (item: T, context: CommandContext) => Card | Promise<Card>;
  search: (query: string, env: Env) => Promise<APIApplicationCommandOptionChoice[]>;
}) => {
  const render = async (context: CommandContext, id: number, pageId?: string) => {
    const item = await options.find(id, context.env);
    if (!item) return null;
    return cardToComponents(await options.toCard(item, context), { navId: `${options.name}:${id}`, pageId });
  };

  const command: Command = {
    async handle(context) {
      const components = await render(context, context.getRequiredNumber('id'));

      if (!components) {
        await context.reply({ content: options.notFound, flags: MessageFlags.Ephemeral });
        return;
      }

      await context.reply({ components, flags: MessageFlags.IsComponentsV2 | MessageFlags.SuppressNotifications });
    },

    async component(context, [id, pageId]) {
      const components = await render(context, Number(id), pageId);

      if (!components) {
        await context.reply({ content: options.notFound, flags: MessageFlags.Ephemeral });
        return;
      }

      await context.update({ components });
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
  };

  return command;
};
