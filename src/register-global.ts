import { RouteBases, Routes } from 'discord-api-types/v10';
import * as dotenv from 'dotenv';
import { commandList } from './command.list';

dotenv.config({ path: '.prod.vars' });

const registerCommands = async () => {
  if (!process.env.DISCORD_TOKEN) {
    throw new Error('No token passed');
  }
  if (!process.env.DISCORD_APPLICATION_ID) {
    throw new Error('No application id passed');
  }

  await fetch(RouteBases.api + Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), {
    method: 'PUT',
    headers: {
      'Content-Type': `application/json`,
      'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
    },
    body: JSON.stringify(commandList)
  });

  console.info(`✅ Refreshed ${commandList.length} commands`);
};

await registerCommands();
