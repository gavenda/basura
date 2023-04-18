import { Routes } from 'discord-api-types/v10';
import * as dotenv from 'dotenv';
import { COMMAND_ABOUT, COMMAND_LINK, COMMAND_UNLINK } from './commands.js';
import { discordApi } from './util.js';

dotenv.config({ path: '.dev.vars' });

const registerGuildCommands = async () => {
  const token = process.env.DISCORD_TOKEN;
  const applicationId = process.env.DISCORD_APPLICATION_ID;
  const guildId = process.env.DISCORD_TEST_GUILD_ID;

  if (!token) {
    throw new Error('No token passed');
  }
  if (!applicationId) {
    throw new Error('No application id passed');
  }
  if (!guildId) {
    throw new Error('No test guild id passed');
  }

  fetch(discordApi(Routes.applicationGuildCommands(applicationId, guildId)), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify([COMMAND_ABOUT, COMMAND_LINK, COMMAND_UNLINK]),
  });
};

await registerGuildCommands();
