import { kvRateLimitedFetch } from '../utils/kv-fetch';

const ANILIST_ENDPOINT = 'https://graphql.anilist.co/';

/** Cache lifetimes (seconds) for AniList data. */
export const CACHE_TTL = {
  /** Autocomplete search results. Titles and names rarely change. */
  search: 60 * 60 * 6,
  /** Media, character and staff detail pages. */
  details: 60 * 15
} as const;

export interface AniListRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
  env: Env;
  /** Seconds to keep a successful response in the Cloudflare cache. 0 or unset disables caching. */
  cacheTtl?: number;
  /** Wait out rate limits (default) or fail fast. See `RateLimitOptions`. */
  waitOnRateLimit?: boolean;
}

interface GraphQLResponse<T> {
  data?: T | null;
  errors?: { message: string }[];
}

const sha256 = async (text: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Sends a query to AniList and returns its data.
 *
 * An unknown id comes back from AniList as a 404 with null data, so that resolves (with the null field)
 * instead of throwing. Every other failure throws.
 */
export const aniListRequest = async <T>(options: AniListRequestOptions): Promise<T> => {
  const { query, variables, env, cacheTtl = 0, waitOnRateLimit = true } = options;
  const body = JSON.stringify({ query, variables });

  // POST responses aren't cached by Cloudflare, so cache under a synthetic GET key instead.
  // The Cache API is per data center and only works on custom domains (not *.workers.dev).
  const cacheKey = cacheTtl > 0 ? new Request(`${ANILIST_ENDPOINT}__cache/v2/${await sha256(body)}`) : undefined;

  if (cacheKey) {
    const cached = await caches.default.match(cacheKey);
    if (cached) return cached.json<T>();
  }

  const response = await kvRateLimitedFetch(
    ANILIST_ENDPOINT,
    env,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body },
    { wait: waitOnRateLimit }
  );

  const result = await response.json<GraphQLResponse<T>>().catch(() => undefined);

  if (!result?.data || (!response.ok && response.status !== 404)) {
    const reason = result?.errors?.[0]?.message ?? 'no data returned';
    throw new Error(`AniList request failed with HTTP ${response.status}: ${reason}`);
  }

  if (cacheKey && response.ok && !result.errors?.length) {
    await caches.default.put(
      cacheKey,
      new Response(JSON.stringify(result.data), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${cacheTtl}` }
      })
    );
  }

  return result.data;
};

/** Request for autocomplete: cached, and fails fast when rate limited so Discord's 3s deadline isn't missed. */
export const aniListSearchRequest = <T>(options: Omit<AniListRequestOptions, 'cacheTtl' | 'waitOnRateLimit'>) => {
  return aniListRequest<T>({ ...options, cacheTtl: CACHE_TTL.search, waitOnRateLimit: false });
};

/** Lowercases and collapses whitespace so equivalent searches share a cache entry. */
export const normalizeSearch = (search: string) => search.trim().toLowerCase().replace(/\s+/g, ' ');
