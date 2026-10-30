import type { Client } from 'discord.js';

/**
 * Passed to every event, handler and command instead of importing the client
 * directly, so each of them can be read (and exercised) on its own.
 */
export interface AppContext {
  client: Client;
}
