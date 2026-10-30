import { REST, Routes, type APIApplication } from 'discord.js';
import { getCommandData } from '../commands';
import { env } from '../env';
import { logger } from '../logging';

const log = logger('discord');

/**
 * Replaces the application's commands with the current list: in `DISCORD_DEV_GUILD_ID` when set,
 * where changes show up instantly, otherwise globally.
 */
export const registerCommands = async (rest: REST, applicationId?: string): Promise<void> => {
  const appId = applicationId ?? ((await rest.get(Routes.currentApplication())) as APIApplication).id;
  const commandData = getCommandData();
  const guildId = env.DISCORD_DEV_GUILD_ID;
  const route = guildId ? Routes.applicationGuildCommands(appId, guildId) : Routes.applicationCommands(appId);

  await rest.put(route, { body: commandData });
  log.info`registered ${commandData.length} command(s) ${guildId ? `in guild ${guildId}` : 'globally'}`;
};
