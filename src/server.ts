import { Database } from '@db/database';
import { D1Dialect } from '@db/kysely-d1';
import { App } from '@studio-bogus/discord-interaction-app';
import { Kysely } from 'kysely';
import { checkAiringAnimes } from './airing';
import { commands } from './commands/commands';
import { Env } from './env';

export default {
  /**
   * Every request to a worker will start in the `fetch` method.
   * Verify the signature with the request, and dispatch to the router.
   * @param {*} request A Fetch Request object
   * @param {*} environment A map of key/value pairs with env vars and secrets from the cloudflare env.
   * @returns
   */
  async fetch(request: Request, environment: Env, executionContext: ExecutionContext) {
    // A simple :wave: hello page to verify the worker is working.
    if (request.method === 'GET') {
      return new Response(`👋 ${environment.DISCORD_APPLICATION_ID}`);
    }
    // We handle interactions through here.
    if (request.method === 'POST') {
      // Initialize our database
      environment.DB = new Kysely<Database>({
        dialect: new D1Dialect({ database: environment.D1 })
      });

      const app = new App({
        token: environment.DISCORD_TOKEN?.trim(),
        id: environment.DISCORD_APPLICATION_ID?.trim(),
        publicKey: environment.DISCORD_PUBLIC_KEY?.trim(),
        commands,
        environment,
        executionContext,
        cacheNamespace: environment.CACHE,
        bucketNamespace: environment.BUCKET
      });

      return await app.handle(request);
    }

    // We don't support anything other than the post and get methods.
    return new Response('Method not allowed.', { status: 401 });
  },
  async scheduled(event: ScheduledEvent, environment: Env, executionContext: ExecutionContext) {
    switch (event.cron) {
      // Every hour
      case '0 * * * *':
        // Check airing animes and notify
        executionContext.waitUntil(checkAiringAnimes(environment));
        break;
      default:
        break;
    }
  }
};
