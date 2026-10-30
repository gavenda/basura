// First, so LogTape is configured before any other module logs while loading.
import { logger } from './logging';

import type { AppContext } from './context';
import { closeCache, connectCache } from './cache';
import { db } from './db';
import { client } from './discord/client';
import { env } from './env';
import { registerEvents } from './events';
import { startHealthServer } from './health';

const discordLog = logger('discord');

const context: AppContext = { client };

// Required before taking interactions: AniList's rate limits are too strict to run uncached.
await connectCache();

registerEvents(client, context);
const server = startHealthServer();
await login();

/** Turns a rejected token into instructions, instead of a websocket stack trace from deep inside discord.js. */
async function login(): Promise<void> {
  try {
    await client.login(env.DISCORD_TOKEN);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.toLowerCase().includes('invalid token')) {
      discordLog.fatal(
        'Discord rejected the bot token.\n' +
          '  Check DISCORD_TOKEN against the Bot page of your application.\n' +
          '  Note that the bot token is not the client secret.'
      );
      process.exit(1);
    }

    throw error;
  }
}

async function shutdown(signal: string): Promise<void> {
  logger('shutdown').info`received ${signal}`;
  await server.stop(true);
  await client.destroy();
  closeCache();
  db.close();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
