// Registers slash commands with Discord. Run with `bun run register` (global) or `bun run register:dev` (test guilds).
import { RouteBases, Routes } from 'discord-api-types/v10';
import { commandList } from './command.list';

/** Guilds that get commands instantly with `register:dev`. Add your own server to test there. */
const DEV_GUILD_IDS = [
  // Developer server
  '672642223942139915'
];

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) throw new Error('No token passed');
if (!applicationId) throw new Error('No application id passed');

const isDev = process.argv.includes('--dev');
const targets = isDev
  ? DEV_GUILD_IDS.map((guildId) => ({
      name: `guild ${guildId}`,
      route: Routes.applicationGuildCommands(applicationId, guildId)
    }))
  : [{ name: 'globally', route: Routes.applicationCommands(applicationId) }];

for (const { name, route } of targets) {
  const response = await fetch(RouteBases.api + route, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bot ${token}`
    },
    body: JSON.stringify(commandList)
  });

  if (!response.ok) {
    throw new Error(`Failed to register commands ${name} (HTTP ${response.status}): ${await response.text()}`);
  }

  console.info(`✅ Refreshed ${commandList.length} commands ${name}`);
}
