import { cacheGet, cacheSet } from '../cache';
import { logger } from '../logging';
import { rateLimitedFetch } from './rate-limit';

const log = logger('anilist');

const ANILIST_ENDPOINT = 'https://graphql.anilist.co/';

/** Cache lifetimes (seconds) for AniList data. */
export const CACHE_TTL = {
  /** Autocomplete search results. Titles and names rarely change. */
  search: 60 * 60 * 6,
  /** Media, character and staff detail pages. */
  details: 60 * 15,
  /** An id AniList doesn't know. */
  notFound: 60 * 5,
  /** Guild members' list entries on a media card. Short, since scores and progress change often. */
  memberEntries: 60 * 2
} as const;

export interface AniListRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
  /** Seconds to keep a successful response in the Valkey cache. 0 or unset disables caching. */
  cacheTtl?: number;
  /** Wait out rate limits (default) or fail fast. See `RateLimitOptions`. */
  waitOnRateLimit?: boolean;
}

interface GraphQLResponse<T> {
  data?: T | null;
  errors?: { message: string }[];
}

/** Requests already on their way to AniList, by cache key, so identical lookups at the same moment share one. */
const inFlight = new Map<string, Promise<unknown>>();

const hashBody = (body: string) => new Bun.CryptoHasher('sha256').update(body).digest('hex');

/** Sends the query to AniList, without the cache. */
const fetchAniList = async <T>(body: string, waitOnRateLimit: boolean): Promise<{ data: T; found: boolean }> => {
  const response = await rateLimitedFetch(
    ANILIST_ENDPOINT,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body },
    { wait: waitOnRateLimit }
  );

  const result = (await response.json().catch(() => undefined)) as GraphQLResponse<T> | undefined;

  if (!result?.data || (!response.ok && response.status !== 404)) {
    const reason = result?.errors?.[0]?.message ?? 'no data returned';
    throw new Error(`AniList request failed with HTTP ${response.status}: ${reason}`);
  }

  return { data: result.data, found: response.ok };
};

/**
 * Sends a query to AniList and returns its data.
 *
 * An unknown id comes back from AniList as a 404 with null data, so that resolves (with the null field)
 * instead of throwing. Every other failure throws.
 *
 * With a cacheTtl the answer is cached in Valkey, unknown ids included, and the request fails with
 * `CacheUnavailableError` rather than reach AniList uncached when Valkey is down.
 */
export const aniListRequest = async <T>(options: AniListRequestOptions): Promise<T> => {
  const { query, variables, cacheTtl = 0, waitOnRateLimit = true } = options;
  const body = JSON.stringify({ query, variables });

  if (cacheTtl <= 0) return (await fetchAniList<T>(body, waitOnRateLimit)).data;

  const cacheKey = `anilist:${hashBody(body)}`;
  const cached = await cacheGet<T>(cacheKey);
  if (cached !== undefined) return cached;

  const pending = inFlight.get(cacheKey);
  if (pending) return pending as Promise<T>;

  const request = (async () => {
    const { data, found } = await fetchAniList<T>(body, waitOnRateLimit);
    // Unknown ids are kept for less time, in case they're new entries AniList hasn't finished adding.
    // The answer is already paid for, so a failed write still returns it.
    await cacheSet(cacheKey, data, found ? cacheTtl : Math.min(cacheTtl, CACHE_TTL.notFound)).catch((error) => {
      log.warning`could not cache an AniList response: ${error}`;
    });
    return data;
  })().finally(() => inFlight.delete(cacheKey));

  inFlight.set(cacheKey, request);
  return request;
};

/** Request for autocomplete: cached, and fails fast when rate limited so Discord's 3s deadline isn't missed. */
export const aniListSearchRequest = <T>(options: Omit<AniListRequestOptions, 'cacheTtl' | 'waitOnRateLimit'>) => {
  return aniListRequest<T>({ ...options, cacheTtl: CACHE_TTL.search, waitOnRateLimit: false });
};

/** Lowercases and collapses whitespace so equivalent searches share a cache entry. */
export const normalizeSearch = (search: string) => search.trim().toLowerCase().replace(/\s+/g, ' ');
