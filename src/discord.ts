import { RouteBases } from 'discord-api-types/v10';
import { kvRateLimitedFetch } from './utils/kv-fetch';

/** Calls the Discord API as the bot, waiting out rate limits. Throws when Discord responds with an error. */
export const discordRequest = async <T>(env: Env, method: string, route: string, body?: unknown): Promise<T> => {
  const response = await kvRateLimitedFetch(RouteBases.api + route, env, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Basura/2.0',
      'Authorization': `Bot ${env.DISCORD_TOKEN}`
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Discord ${method} ${route} failed with HTTP ${response.status}`);
  }

  return response.json<T>();
};
