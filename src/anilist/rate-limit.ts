import { valkey, valkeyKey } from '../cache';
import { env } from '../env';
import { logger } from '../logging';
import { sleep } from '../utils/sleep';

const log = logger('anilist');

/**
 * AniList's rate limit state, kept in Valkey so it survives restarts: a bot restarted during a
 * block must not hit AniList again straight away. Two parts:
 *
 * - A budget of requests per minute (`ANILIST_REQUESTS_PER_MINUTE`), counted before each request,
 *   so the limit is never reached in the first place.
 * - A block until a given time, set when AniList answers 429 or says no requests are left.
 */
const BLOCKED_KEY = valkeyKey('ratelimit:anilist:blocked');
const windowKey = (window: number) => valkeyKey(`ratelimit:anilist:window:${window}`);

const WINDOW_MS = 60_000;
/** The longest a request waits for the limit to lift. Past this it fails instead. */
const MAX_WAIT_MS = 60_000;
const MAX_ATTEMPTS = 3;

/** Counts a request in the current window, atomically, and returns the count. */
const COUNT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return count`;

/** Moves the block later, never earlier, and expires the key when it lifts. */
const BLOCK_SCRIPT = `
local current = tonumber(redis.call('GET', KEYS[1]) or '0')
local untilMs = tonumber(ARGV[1])
if untilMs > current then redis.call('SET', KEYS[1], ARGV[1], 'PX', ARGV[2]) end
return 0`;

/** Thrown instead of sending a request that AniList would refuse. */
export class RateLimitedError extends Error {
  constructor(readonly retryAfterMs: number) {
    super(`AniList rate limit reached, retry in ${Math.ceil(retryAfterMs / 1000)}s`);
    this.name = 'RateLimitedError';
  }
}

export interface RateLimitOptions {
  /**
   * When true (default), wait out a rate limit, up to MAX_WAIT_MS, and retry.
   * When false, throw `RateLimitedError` right away. Use this for anything with a hard deadline,
   * like autocomplete, which Discord drops after 3 seconds.
   */
  wait?: boolean;
}

const blockedUntil = async (): Promise<number> => Number((await valkey((redis) => redis.get(BLOCKED_KEY))) ?? 0);

const blockUntil = async (untilMs: number, reason: string) => {
  const ttl = Math.max(1, Math.ceil(untilMs - Date.now()));
  await valkey((redis) => redis.send('EVAL', [BLOCK_SCRIPT, '1', BLOCKED_KEY, String(untilMs), String(ttl)]));
  log.warning`${reason}, holding requests until ${new Date(untilMs).toISOString()}`;
};

/** Counts this request against the minute's budget. Returns 0 when it fits, else how long until the next window. */
const takeBudget = async (): Promise<number> => {
  const now = Date.now();
  const window = Math.floor(now / WINDOW_MS);
  const count = Number(
    await valkey((redis) => redis.send('EVAL', [COUNT_SCRIPT, '1', windowKey(window), String(WINDOW_MS * 2)]))
  );
  return count <= env.ANILIST_REQUESTS_PER_MINUTE ? 0 : (window + 1) * WINDOW_MS - now;
};

/** Waits out `ms`, or throws when the caller can't wait or it's longer than MAX_WAIT_MS. */
const waitOrThrow = async (ms: number, wait: boolean) => {
  if (!wait || ms > MAX_WAIT_MS) throw new RateLimitedError(ms);
  log.debug`rate limited, waiting ${Math.ceil(ms / 1000)}s`;
  await sleep(ms);
};

/** Holds the request until AniList's limit allows it. */
const acquire = async (wait: boolean) => {
  while (true) {
    const blocked = (await blockedUntil()) - Date.now();
    if (blocked > 0) {
      await waitOrThrow(blocked, wait);
      continue;
    }

    const untilNextWindow = await takeBudget();
    if (untilNextWindow === 0) return;
    await waitOrThrow(untilNextWindow, wait);
  }
};

/**
 * When a limit lifts, from Retry-After or X-RateLimit-Reset (seconds since the epoch), else after
 * `fallbackMs`. AniList only sends those on a 429, not with the last request of a minute.
 */
const resetTime = (response: Response, fallbackMs: number): number => {
  const retryAfter = parseFloat(response.headers.get('Retry-After') ?? '');
  if (retryAfter > 0) return Date.now() + retryAfter * 1000 + 250;

  const reset = parseFloat(response.headers.get('X-RateLimit-Reset') ?? '');
  if (reset * 1000 > Date.now()) return reset * 1000 + 250;

  return Date.now() + fallbackMs;
};

/**
 * Fetch from AniList within its rate limit, shared through Valkey. Throws `RateLimitedError` when the
 * request can't be sent in time, and `CacheUnavailableError` when Valkey is down.
 */
export const rateLimitedFetch = async (
  url: string,
  init: RequestInit,
  options: RateLimitOptions = {},
  attempt = 1
): Promise<Response> => {
  const { wait = true } = options;

  await acquire(wait);
  const response = await fetch(url, init);

  if (response.status === 429) {
    await blockUntil(resetTime(response, Math.pow(2, attempt) * 1000), 'AniList answered 429');
    if (!wait || attempt >= MAX_ATTEMPTS) throw new RateLimitedError((await blockedUntil()) - Date.now());
    return rateLimitedFetch(url, init, options, attempt + 1);
  }

  // AniList says how many requests are left this minute. At none, hold off until it resets.
  if (response.headers.get('X-RateLimit-Remaining') === '0') {
    await blockUntil(resetTime(response, WINDOW_MS), 'AniList has no requests left this minute');
  }

  // 404s are expected (unknown AniList ids), so only log other failures.
  if (!response.ok && response.status !== 404) {
    log.error`AniList answered HTTP ${response.status}: ${await response.clone().text()}`;
  }

  return response;
};
