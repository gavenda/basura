/** Registers commands without starting the gateway (`bun run commands:deploy`); startup does this too. */
import '../logging';

import { REST } from 'discord.js';
import { env } from '../env';
import { registerCommands } from './register-commands';

await registerCommands(new REST().setToken(env.DISCORD_TOKEN));
