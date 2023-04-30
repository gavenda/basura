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
  LOGTAIL_TOKEN: string;
  CACHE: KVNamespace;
  BUCKET: KVNamespace;
  NOTIFICATION: KVNamespace;
  DB: Kysely<Database>;
}

export interface KVWebhook {
  id: string;
  threadId: string;
  token: string;
}
