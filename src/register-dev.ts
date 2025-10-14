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
  if (!process.env.DISCORD_TOKEN) {
    throw new Error('No token passed');
  }
  if (!process.env.DISCORD_APPLICATION_ID) {
    throw new Error('No application id passed');
  }

  for (const guildId of testGuildIds) {
    await fetch(DISCORD_API_V10 + Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, guildId), {
      method: 'PUT',
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
      },
      body: JSON.stringify(commandList)
    });

    console.info(`✅ Refreshed ${commandList.length} commands in guild ${guildId}`);
  }
};

await registerGuildCommands();
