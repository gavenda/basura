import { Events } from 'discord.js';
import { chatInputCommands } from '../commands/chat-input';
import { logger } from '../logging';
import { replyWithError } from '../utils/reply-with-error';
import type { AppEvent } from './event';

const log = logger('discord');

export const chatInputCommandInteractionEvent: AppEvent<Events.InteractionCreate> = {
  event: Events.InteractionCreate,
  once: false,
  execute: async (context, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = chatInputCommands.find((entry) => entry.name === interaction.commandName);

    if (!command) {
      log.warning`no command registered for /${interaction.commandName}`;
      return;
    }

    try {
      await command.execute(context, interaction);
    } catch (error) {
      log.error`/${interaction.commandName} threw: ${error}`;
      await replyWithError(interaction, error);
    }
  }
};
