import { Events } from 'discord.js';
import { logger } from '../logging';
import type { AppEvent } from './event';

const log = logger('discord');

export const errorEvent: AppEvent<Events.Error> = {
  event: Events.Error,
  once: false,
  execute: (_context, error) => {
    log.error`client error: ${error}`;
  }
};
