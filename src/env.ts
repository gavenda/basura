import { Database } from '@db/database.js';
import { Kysely } from 'kysely';

export interface Env {
  ENVIRONMENT: string;
  DISCORD_TOKEN: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
  DATABASE_HOST: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  D1_DATABASE: D1Database;
  DB: Kysely<Database>;
  UPSTASH_REDIS_REST_TOKEN: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_DISABLE_TELEMETRY: string;
}
