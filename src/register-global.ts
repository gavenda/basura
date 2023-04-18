import * as dotenv from 'dotenv';

dotenv.config({ path: '.dev.vars' });

const registerCommands = async () => {
  const token = process.env.DISCORD_TOKEN;

  if (!token) {
    throw new Error('No token passed');
  }
};

await registerCommands();
