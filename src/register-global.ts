import { Routes } from 'discord-api-types/v10';
import * as dotenv from 'dotenv';
import { commandList } from './command.list';

dotenv.config({ path: '.prod.vars' });

const DISCORD_API_V10 = `https://discord.com/api/v10`;

const registerCommands = async () => {
  const token = process.env.DISCORD_TOKEN?.trim();
  const applicationId = process.env.DISCORD_APPLICATION_ID?.trim();

  if (!token) {
    throw new Error('No token passed');
  }
  if (!applicationId) {
    throw new Error('No application id passed');
  }

  const result = await fetch(DISCORD_API_V10 + Routes.applicationCommands(applicationId), {
    method: 'PUT',
    headers: {
      'Content-Type': `application/json`,
      'Authorization': `Bot ${token}`
    },
    body: JSON.stringify(commandList)
  });

  const json = await result.json();

  console.log(json);
};

await registerCommands();
