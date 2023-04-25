import { Database } from '@db/database.js';
import { Redis } from '@upstash/redis/cloudflare';
import { Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { App } from './app/app.js';
import { commands } from './commands/commands.js';
import { Env } from './env.js';

export default {
  /**
   * Every request to a worker will start in the `fetch` method.
   * Verify the signature with the request, and dispatch to the router.
   * @param {*} request A Fetch Request object
   * @param {*} env A map of key/value pairs with env vars and secrets from the cloudflare env.
   * @returns
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // A simple :wave: hello page to verify the worker is working.
    if (request.method === 'GET') {
      return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
    }
    // We handle interactions through here.
    if (request.method === 'POST') {
      // Initialize our database
      env.DB = new Kysely<Database>({
        dialect: new PlanetScaleDialect({
          host: env.DATABASE_HOST,
          username: env.DATABASE_USERNAME,
          password: env.DATABASE_PASSWORD,
        }),
      });

      const redis = Redis.fromEnv(env);
      const app = new App({
        token: env.DISCORD_TOKEN,
        id: env.DISCORD_APPLICATION_ID,
        publicKey: env.DISCORD_PUBLIC_KEY,
        commands,
        environment: env,
        executionContext: ctx,
        redis,
      });

      return app.handle(request);
    }

    // We don't support anything other than the post and get methods.
    return new Response('Method not allowed.', { status: 401 });
  },
};
