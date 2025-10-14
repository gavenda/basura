import { Routes } from 'discord-api-types/v10';
import * as dotenv from 'dotenv';
import { commandList } from './command.list';

dotenv.config({ path: '.dev.vars' });

const testGuildIds: string[] = [
  // Developer server
  `672642223942139915`
];

const DISCORD_API_V10 = `https://discord.com/api/v10`;

const registerGuildCommands = async () => {
  const token = process.env.DISCORD_TOKEN?.trim();
  const applicationId = process.env.DISCORD_APPLICATION_ID?.trim();

  if (!token) {
    throw new Error('No token passed');
  }
  if (!applicationId) {
    throw new Error('No application id passed');
  }

  for (const guildId of testGuildIds) {
    await fetch(DISCORD_API_V10 + Routes.applicationGuildCommands(applicationId, guildId), {
      method: 'PUT',
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bot ${token}`
      },
      body: JSON.stringify(commandList)
    });

    console.info(`✅ Refreshed ${commandList.length} commands in guild ${guildId}`);
  }
};

await registerGuildCommands();
