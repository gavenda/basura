import { Routes } from 'discord-api-types/v10';
import * as dotenv from 'dotenv';
import { commandList } from './command.list';

dotenv.config({ path: '.prod.vars' });

const DISCORD_API_V10 = `https://discord.com/api/v10`;

const registerCommands = async () => {
  if (!process.env.DISCORD_TOKEN) {
    throw new Error('No token passed');
  }
  if (!process.env.DISCORD_APPLICATION_I) {
    throw new Error('No application id passed');
  }

  const result = await fetch(DISCORD_API_V10 + Routes.applicationCommands(process.env.DISCORD_APPLICATION_I), {
    method: 'PUT',
    headers: {
      'Content-Type': `application/json`,
      'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
    },
    body: JSON.stringify(commandList)
  });

  const json = await result.json();

  console.info(`✅ Refreshed ${commandList.length} commands`);
};

await registerCommands();
