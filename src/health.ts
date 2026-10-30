import { isCacheConnected } from './cache';
import { isConnected } from './discord/client';
import { env } from './env';
import { logger } from './logging';

/**
 * The container's health check. Answers 200 while connected to both the gateway and Valkey, and 503
 * naming what's down otherwise, so a bot stuck disconnected gets restarted.
 */
export const startHealthServer = () => {
  const server = Bun.serve({
    hostname: env.HOST,
    port: env.PORT,
    routes: {
      '/health': () => {
        const down = [!isConnected() && 'gateway', !isCacheConnected() && 'valkey'].filter(Boolean);
        return down.length === 0 ? new Response('ok') : new Response(`down: ${down.join(', ')}`, { status: 503 });
      }
    },
    fetch: () => new Response('Not found.', { status: 404 })
  });

  logger('http').info`health check on ${new URL('/health', server.url).href}`;
  return server;
};
