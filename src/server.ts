import { Database } from '@db/database.js';
import { D1Dialect } from '@db/kysely-d1.js';
import { App } from '@studio-bogus/discord-interaction-app';
import { LogtailTransport } from '@studio-bogus/logging/logtail';
import { Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { checkAiringAnimes } from './airing.js';
import { commands } from './commands/commands.js';
import { Env } from './env.js';

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

      // PlanetScale
      if (environment.ENVIRONMENT === 'production') {
        environment.DB = new Kysely<Database>({
          dialect: new PlanetScaleDialect({
            host: environment.DATABASE_HOST,
            username: environment.DATABASE_USERNAME,
            password: environment.DATABASE_PASSWORD,
          }),
        });
      }

      // D1
      if (environment.ENVIRONMENT === 'development') {
        environment.DB = new Kysely<Database>({
          dialect: new D1Dialect({ database: environment.D1 }),
        });
      }

      const app = new App({
        token: environment.DISCORD_TOKEN,
        id: environment.DISCORD_APPLICATION_ID,
        publicKey: environment.DISCORD_PUBLIC_KEY,
        commands,
        environment,
        executionContext,
        cacheNamespace: environment.CACHE,
        bucketNamespace: environment.BUCKET,
      });

      // Add logtail
      app.logger.add(new LogtailTransport(environment.LOGTAIL_TOKEN, executionContext));

      return await app.handle(request);
    }

    // We don't support anything other than the post and get methods.
    return new Response('Method not allowed.', { status: 401 });
  },
  async scheduled(event: ScheduledEvent, environment: Env, executionContext: ExecutionContext) {
    switch (event.cron) {
      // Every 2 minutes
      case '*/2 * * * *':
        // Check airing animes and notify
        executionContext.waitUntil(checkAiringAnimes(environment));
        break;
      default:
        break;
    }
  },
};
