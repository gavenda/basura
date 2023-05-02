import { Client } from '@studio-bogus/discord-interaction-client';
import { Routes } from 'discord-api-types/v10';
import * as dotenv from 'dotenv';
import { commandList } from './commands/index.js';

dotenv.config({ path: '.prod.vars' });

const registerCommands = async () => {
  const token = process.env.DISCORD_TOKEN;
  const applicationId = process.env.DISCORD_APPLICATION_ID;

  if (!token) {
    throw new Error('No token passed');
  }
  if (!applicationId) {
    throw new Error('No application id passed');
  }

  const client = new Client().setToken(token);
  await client.put(Routes.applicationCommands(applicationId), {
    body: commandList,
  });
};

await registerCommands();
