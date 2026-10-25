import { GraphQLClient, RequestOptions } from './graphql/client';

const ANILIST_ENDPOINT = `https://graphql.anilist.co/`;

/** Cache lifetimes (seconds) for AniList data. */
export const CACHE_TTL = {
  /** Autocomplete search results. Titles and names rarely change. */
  search: 60 * 60 * 6,
  /** Media, character and staff detail pages. */
  details: 60 * 15
} as const;

const graphQlClient = new GraphQLClient(ANILIST_ENDPOINT);

export const aniListRequest = <T>(options: RequestOptions): Promise<T> => {
  return graphQlClient.request<T>(options);
};

/** Request for autocomplete: cached, and fails fast when rate limited so Discord's 3s deadline isn't missed. */
export const aniListSearchRequest = <T>(options: Omit<RequestOptions, 'cacheTtl' | 'waitOnRateLimit'>): Promise<T> => {
  return graphQlClient.request<T>({ ...options, cacheTtl: CACHE_TTL.search, waitOnRateLimit: false });
};

/** Lowercases and collapses whitespace so equivalent searches share a cache entry. */
export const normalizeSearch = (search: string) => search.trim().toLowerCase().replace(/\s+/g, ' ');
