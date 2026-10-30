import { z } from 'zod';
import { logger } from './logging';

const snowflake = z.string().regex(/^\d{17,20}$/, 'must be a Discord snowflake ID');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /** The health check server. The container checks it from inside, so it never needs publishing. */
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().positive().default(8080),

  DISCORD_TOKEN: z.string().min(1),
  /**
   * Registers commands in this server only, where they show up instantly, instead of globally.
   * Set it while developing; leave it blank in production.
   */
  DISCORD_DEV_GUILD_ID: z.preprocess((value) => (value === '' ? undefined : value), snowflake.optional()),

  DATABASE_PATH: z.string().default('data/basura.sqlite'),

  /**
   * Valkey (or Redis) caching AniList responses, keys under `basura:`, each with an expiry.
   * Required: AniList's rate limits are too strict to run uncached.
   */
  /**
   * How many requests a minute to send AniList, counted in Valkey. AniList allows 90, but has run at a
   * degraded 30 for a long time; its rate limit headers are followed either way.
   */
  ANILIST_REQUESTS_PER_MINUTE: z.coerce.number().int().positive().default(30),

  REDIS_URL: z.url({ protocol: /^(redis|rediss|valkey|valkeys)$/ }).default('redis://127.0.0.1:6379')
});

export type Env = z.infer<typeof schema>;

const load = (): Env => {
  const parsed = schema.safeParse(Bun.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    logger('env').fatal`Invalid environment configuration:\n${issues}\n\nSee .env.example.`;
    process.exit(1);
  }
  return parsed.data;
};

export const env = load();
export const isProduction = env.NODE_ENV === 'production';
