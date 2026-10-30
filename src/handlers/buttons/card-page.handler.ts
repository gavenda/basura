import { MessageFlags } from 'discord.js';
import { CARD_PAGE_PREFIX, decodeCardPageId } from '../../discord/ids';
import { lookups, renderLookup } from '../../discord/lookups';
import type { AppButtonHandler } from './button-handler';

/** Re-renders an AniList card in place on the page whose button was clicked. */
export const cardPageHandler: AppButtonHandler = {
  customId: CARD_PAGE_PREFIX,
  handle: async (_context, interaction) => {
    const decoded = decodeCardPageId(interaction.customId);
    const lookup = decoded && lookups.find((entry) => entry.kind === decoded.kind);

    if (!decoded || !lookup) {
      await interaction.reply({ content: 'This button is not supported.', flags: MessageFlags.Ephemeral });
      return;
    }

    // AniList can take longer than the 3 seconds Discord allows for a first reply.
    await interaction.deferUpdate();

    const components = await renderLookup(lookup, decoded.id, interaction.guildId, decoded.page);

    if (!components) {
      await interaction.followUp({ content: lookup.notFound, flags: MessageFlags.Ephemeral });
      return;
    }

    await interaction.editReply({ components });
  }
};
