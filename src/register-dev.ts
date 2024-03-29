import { Client } from '@studio-bogus/discord-interaction-client';
import { Routes } from 'discord-api-types/v10';
import * as dotenv from 'dotenv';
import { commandList } from './commands/index';

dotenv.config({ path: '.dev.vars' });

const testGuildIds: string[] = [
  // Developer server
  `672642223942139915`
];

const registerGuildCommands = async () => {
  const token = process.env.DISCORD_TOKEN?.trim();
  const applicationId = process.env.DISCORD_APPLICATION_ID?.trim();

  if (!token) {
    throw new Error('No token passed');
  }
  if (!applicationId) {
    throw new Error('No application id passed');
  }

  const client = new Client().setToken(token);
  for (const guildId of testGuildIds) {
    await client.put(Routes.applicationGuildCommands(applicationId, guildId), {
      body: commandList
    });
  }
};

await registerGuildCommands();
