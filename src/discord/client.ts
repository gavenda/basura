import { Client, GatewayIntentBits, Status } from 'discord.js';

/**
 * Interactions arrive over the gateway whatever the intents. `Guilds` keeps discord.js's guild
 * and channel cache filled, which it expects. No privileged intents are needed.
 */
export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/** True while logged in with the gateway connection up. */
export const isConnected = (): boolean => client.isReady() && client.ws.status === Status.Ready;
