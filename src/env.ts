import { Client } from '@planetscale/database';

export interface Env {
  DISCORD_TEST_GUILD_ID: string;
  DISCORD_TOKEN: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
  DATABASE_HOST: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DB_FACTORY: Client;
  CACHE: KVNamespace;
  BUCKETS: KVNamespace;
  UPSTASH_REDIS_REST_TOKEN: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_DISABLE_TELEMETRY: string;
}
