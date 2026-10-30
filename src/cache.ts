import { RedisClient } from 'bun';
import { env } from './env';
import { logger } from './logging';
import { sleep } from './utils/sleep';

const log = logger('cache');

/** Namespaced so the cache can share a Valkey instance with anything else. */
const PREFIX = 'basura:';

/** How often a request may try to reconnect while Valkey is down. Requests in between fail right away. */
const RECONNECT_INTERVAL_MS = 5_000;
/** How long startup waits for Valkey before giving up. */
const STARTUP_TIMEOUT_MS = 30_000;

/**
 * Thrown when Valkey can't be reached. AniList's rate limits are too strict to serve lookups
 * uncached, so the lookup fails instead of going to AniList.
 */
export class CacheUnavailableError extends Error {
  constructor(cause: unknown) {
    super(`Valkey is unavailable: ${cause instanceof Error ? cause.message : cause}`, { cause });
    this.name = 'CacheUnavailableError';
  }
}

const client = new RedisClient(env.REDIS_URL, {
  // Fail fast instead of queueing commands while Valkey is unreachable.
  enableOfflineQueue: false,
  autoReconnect: true,
  // The default retries for about 30 seconds before giving up, and a lookup waiting on that would
  // miss Discord's deadline. A couple of retries covers a Valkey restart; anything longer is
  // retried by `ready()` instead.
  maxRetries: 2,
  connectionTimeout: 2000
});

let down = false;
let lastAttempt = 0;
/** Set after the first connect, so waiting at startup doesn't log as an outage. */
let started = false;

client.onconnect = () => {
  if (started && down) log.info`reconnected to Valkey`;
  down = false;
};

client.onclose = (error) => {
  if (started && !down) log.error`lost the connection to Valkey: ${error}`;
  down = true;
};

/** True while connected to Valkey. */
export const isCacheConnected = (): boolean => client.connected;

/**
 * The client, connected. A client whose reconnects ran out never retries on its own, so this
 * tries again, at most every RECONNECT_INTERVAL_MS so an outage doesn't slow every request.
 */
const ready = async (): Promise<RedisClient> => {
  if (client.connected) return client;

  const now = Date.now();
  if (now - lastAttempt < RECONNECT_INTERVAL_MS) throw new CacheUnavailableError('not connected');
  lastAttempt = now;

  try {
    await client.connect();
    return client;
  } catch (error) {
    throw new CacheUnavailableError(error);
  }
};

/** A key under the cache's namespace. */
export const valkeyKey = (name: string) => PREFIX + name;

/** Runs commands on the connected client. Throws `CacheUnavailableError` when Valkey can't be reached. */
export const valkey = async <T>(command: (redis: RedisClient) => Promise<T>): Promise<T> => {
  const redis = await ready();
  try {
    return await command(redis);
  } catch (error) {
    throw new CacheUnavailableError(error);
  }
};

/** Reads a cached JSON value, or undefined when missing or expired. Throws `CacheUnavailableError`. */
export const cacheGet = async <T>(key: string): Promise<T | undefined> => {
  const hit = await valkey((redis) => redis.get(valkeyKey(key)));
  return hit === null ? undefined : (JSON.parse(hit) as T);
};

/** Stores a JSON value for ttlSeconds. Throws `CacheUnavailableError`. */
export const cacheSet = async (key: string, value: unknown, ttlSeconds: number): Promise<void> => {
  await valkey((redis) => redis.set(valkeyKey(key), JSON.stringify(value), 'EX', ttlSeconds));
};

/** Connects at startup, waiting a while for Valkey to come up. Exits when it never does. */
export const connectCache = async (): Promise<void> => {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;

  while (true) {
    try {
      await client.connect();
      started = true;
      log.info`connected to Valkey`;
      return;
    } catch (error) {
      if (Date.now() >= deadline) {
        log.fatal`could not connect to Valkey at ${env.REDIS_URL}: ${error}\n  The cache is required, to stay within AniList's rate limits.`;
        process.exit(1);
      }
      log.warning`waiting for Valkey at ${env.REDIS_URL}`;
      await sleep(1000);
    }
  }
};

export const closeCache = (): void => {
  down = false;
  client.onclose = null;
  client.close();
};
