import { Events } from 'discord.js';
import { registerCommands } from '../discord/register-commands';
import { logger } from '../logging';
import type { AppEvent } from './event';

const log = logger('discord');

export const clientReadyEvent: AppEvent<Events.ClientReady> = {
  event: Events.ClientReady,
  once: true,
  execute: async (_context, client) => {
    log.info`logged in as ${client.user.tag}`;

    try {
      await registerCommands(client.rest, client.application.id);
    } catch (error) {
      log.error`command registration failed: ${error}`;
    }
  }
};
