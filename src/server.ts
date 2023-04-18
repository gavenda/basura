import { APIInteraction } from 'discord-api-types/v10';
import { Router } from 'itty-router';
import { App } from './app/app.js';
import { Env } from './env.js';
import { About } from './app/commands/about.js';
import { Link } from './app/commands/link.js';
import { Unlink } from './app/commands/unlink.js';
import { Client } from '@planetscale/database';

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

  env.DB_FACTORY = new Client({
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
  });

  const app = new App({
    token: env.DISCORD_TOKEN,
    id: env.DISCORD_APPLICATION_ID,
    publicKey: env.DISCORD_PUBLIC_KEY,
    commands: {
      about: new About(),
      link: new Link(),
      unlink: new Unlink(),
    },
    env,
    ctx,
  });

  const requestValid = await app.isRequestValid(request);

  if (!requestValid) {
    return new Response('Bad request signature.', { status: 401 });
  }

  const interaction = await request.json<APIInteraction>();
  const [interactionHandler, deferred] = await app.handleInteraction(interaction);

  // Wait for deferred responses.
  ctx.waitUntil(deferred);

  const interactionResponse = await interactionHandler;

  return new Response(JSON.stringify(interactionResponse), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
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
