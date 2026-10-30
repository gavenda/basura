import { Events } from 'discord.js';
import { customIdPrefix } from '../discord/ids';
import { buttonHandlers } from '../handlers/buttons';
import { logger } from '../logging';
import { replyWithError } from '../utils/reply-with-error';
import type { AppEvent } from './event';

const log = logger('discord');

export const buttonInteractionEvent: AppEvent<Events.InteractionCreate> = {
  event: Events.InteractionCreate,
  once: false,
  execute: async (context, interaction) => {
    if (!interaction.isButton()) return;

    const prefix = customIdPrefix(interaction.customId);
    const handler = buttonHandlers.find((entry) => entry.customId === prefix);

    if (!handler) {
      log.warning`no button handler for "${interaction.customId}"`;
      return;
    }

    try {
      await handler.handle(context, interaction);
    } catch (error) {
      log.error`button "${interaction.customId}" threw: ${error}`;
      await replyWithError(interaction, error);
    }
  }
};
