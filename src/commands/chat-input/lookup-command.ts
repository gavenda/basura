import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { Lookup, renderLookup } from '../../discord/lookups';
import { logger } from '../../logging';
import { isSearchTooShort } from '../../utils/strings';
import type { AppChatInputCommand } from './chat-input-command';

const log = logger('anilist');

/**
 * A command that looks something up on AniList by an `id` option, which autocompletes from a search.
 * The result is a card whose page buttons re-render it in place (see `card-page.handler.ts`).
 */
export const lookupCommand = <T>(
  lookup: Lookup<T>,
  text: { description: string; option: string }
): AppChatInputCommand => ({
  name: lookup.kind,
  data: () =>
    new SlashCommandBuilder()
      .setName(lookup.kind)
      .setDescription(text.description)
      .addNumberOption((option) =>
        option.setName('id').setDescription(text.option).setAutocomplete(true).setRequired(true)
      )
      .toJSON(),

  execute: async (_context, interaction) => {
    // AniList can take longer than the 3 seconds Discord allows for a first reply.
    await interaction.deferReply();

    const components = await renderLookup(lookup, interaction.options.getNumber('id', true), interaction.guildId);

    if (!components) {
      await interaction.deleteReply();
      await interaction.followUp({ content: lookup.notFound, flags: MessageFlags.Ephemeral });
      return;
    }

    await interaction.editReply({ components, flags: MessageFlags.IsComponentsV2 });
  },

  // A failed search shows no choices instead of an error.
  autocomplete: async (_context, interaction) => {
    const query = interaction.options.getFocused();
    let choices: Awaited<ReturnType<Lookup['search']>> = [];

    if (!isSearchTooShort(query)) {
      try {
        choices = await lookup.search(query);
      } catch (error) {
        log.warning`autocomplete search for ${lookup.kind} failed: ${error}`;
      }
    }

    await interaction.respond(choices.slice(0, 25));
  }
});
