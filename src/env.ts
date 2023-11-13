import { Database } from '@db/database.js';
import { Kysely } from 'kysely';

export type Environment = 'development' | 'production';

export interface Env {
  ENVIRONMENT: Environment;
  DISCORD_TOKEN: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
  DATABASE_HOST: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  LOGTAIL_TOKEN: string;
  CACHE: KVNamespace;
  BUCKET: KVNamespace;
  NOTIFICATION: KVNamespace;
  D1: D1Database;
  DB: Kysely<Database>;
}

export interface KVWebhook {
  id: string;
  threadId: string;
  token: string;
}
