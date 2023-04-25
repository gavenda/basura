import { Database } from '@db/database.js';
import { Redis } from '@upstash/redis/cloudflare';
import { Router } from 'itty-router';
import { Dialect, Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { App } from './app/app.js';
import { commands } from './commands/commands.js';
import { Env } from './env.js';

const router = Router();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', async (_, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * We handle interactions through here.
 */
router.post('/', async (requestLike, env: Env, ctx: ExecutionContext) => {
  const request = requestLike as any as Request; // eslint-disable-line

  if (env.ENVIRONMENT === 'development') {
    // Use D1 in development
    env.DB = new Kysely<Database>({ dialect: new D1Dialect({ database: env.D1_DATABASE }) as any as Dialect });
  } else {
    // Use PlanetScale for production, since D1 is in GA
    env.DB = new Kysely<Database>({
      dialect: new PlanetScaleDialect({
        host: env.DATABASE_HOST,
        username: env.DATABASE_USERNAME,
        password: env.DATABASE_PASSWORD,
      }),
    });
  }

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
});

/**
 * Fallback route to everything.
 */
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default {
  /**
   * Every request to a worker will start in the `fetch` method.
   * Verify the signature with the request, and dispatch to the router.
   * @param {*} request A Fetch Request object
   * @param {*} env A map of key/value pairs with env vars and secrets from the cloudflare env.
   * @returns
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return router.handle(request, env, ctx);
  },
};
