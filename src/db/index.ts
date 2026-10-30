import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { env } from '../env';
import { logger } from '../logging';

export interface UserRow {
  id: number;
  discord_id: string;
  discord_guild_id: string;
  anilist_id: number;
  anilist_username: string;
}

/** Schema changes, applied in order. The database's user_version records how many have run. Only ever append. */
const MIGRATIONS = [
  /* SQL */ `
    CREATE TABLE anilist_user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id TEXT NOT NULL,
      discord_guild_id TEXT NOT NULL,
      anilist_id INTEGER NOT NULL,
      anilist_username TEXT NOT NULL,
      UNIQUE (discord_id, discord_guild_id, anilist_id)
    );
    CREATE INDEX idx_anilist_user_guild ON anilist_user (discord_guild_id, discord_id);

    CREATE TABLE anilist_guild (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_guild_id TEXT NOT NULL UNIQUE,
      hentai INTEGER NOT NULL DEFAULT 0
    );
  `
];

const migrate = (db: Database) => {
  const { user_version: version } = db.query<{ user_version: number }, []>('PRAGMA user_version').get()!;

  for (let i = version; i < MIGRATIONS.length; i++) {
    db.transaction(() => {
      db.run(MIGRATIONS[i]!);
      db.run(`PRAGMA user_version = ${i + 1}`);
    })();
    logger('db').info`applied migration ${i + 1}`;
  }
};

const open = (path: string) => {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });

  const db = new Database(path, { create: true, strict: true });
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA synchronous = NORMAL');
  db.run('PRAGMA busy_timeout = 5000');
  db.run('PRAGMA foreign_keys = ON');
  migrate(db);
  return db;
};

export const db = open(env.DATABASE_PATH);
