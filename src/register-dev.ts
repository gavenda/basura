import { Routes } from 'discord-api-types/v10';
import * as dotenv from 'dotenv';
import { Client } from './client/client.js';
import { commandList } from './commands/index.js';

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

  const client = new Client().setToken(token);
  await client.put(Routes.applicationGuildCommands(applicationId, guildId), {
    body: commandList,
  });
};

await registerGuildCommands();
