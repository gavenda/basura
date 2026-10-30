import { Events } from 'discord.js';
import { chatInputCommands } from '../commands/chat-input';
import { logger } from '../logging';
import type { AppEvent } from './event';

const log = logger('discord');

export const autocompleteInteractionEvent: AppEvent<Events.InteractionCreate> = {
  event: Events.InteractionCreate,
  once: false,
  execute: async (context, interaction) => {
    if (!interaction.isAutocomplete()) return;

    const command = chatInputCommands.find((entry) => entry.name === interaction.commandName);

    try {
      if (command?.autocomplete) await command.autocomplete(context, interaction);
      else await interaction.respond([]);
    } catch (error) {
      // Usually the 3 second deadline passing, after which nothing can be sent.
      log.warning`autocomplete for /${interaction.commandName} failed: ${error}`;
    }
  }
};
