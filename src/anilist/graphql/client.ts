import { kvRateLimitedFetch } from '../../utils/kv-fetch';
import { ClientError, GraphQLResponse, Variables } from './types';
export { ClientError } from './types';

export interface RequestOptions {
  query: string;
  env: Env;
  variables?: Variables;
  /** Seconds to keep a successful response in the Cloudflare cache. 0 or unset disables caching. */
  cacheTtl?: number;
  /** Wait out rate limits (default) or fail fast. See `RateLimitOptions`. */
  waitOnRateLimit?: boolean;
}

const sha256 = async (text: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

export class GraphQLClient {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async rawRequest<T>(options: RequestOptions): Promise<GraphQLResponse<T>> {
    const { query, variables, env, cacheTtl = 0, waitOnRateLimit = true } = options;
    const body = JSON.stringify({
      query,
      variables
    });

    // POST responses aren't cached by Cloudflare, so cache under a synthetic GET key instead.
    // The Cache API is per data center and only works on custom domains (not *.workers.dev).
    const cache = cacheTtl > 0 ? caches.default : undefined;
    const cacheKey = cache ? new Request(`${this.url}__cache/${await sha256(body)}`) : undefined;

    if (cache && cacheKey) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached.json<GraphQLResponse<T>>();
    }

    const response = await kvRateLimitedFetch(
      this.url,
      env,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      },
      { wait: waitOnRateLimit }
    );

    const result = await getResult<T>(response);

    if (response.ok && typeof result !== 'string') {
      if (cache && cacheKey && !result.errors?.length) {
        await cache.put(
          cacheKey,
          new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${cacheTtl}` }
          })
        );
      }
      return result;
    } else {
      const errorResult = { error: result };
      throw new ClientError(
        { ...errorResult, status: response.status, headers: response.headers },
        { query, variables }
      );
    }
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const { data } = await this.rawRequest<T>(options);

    // we cast data to T here as it will be defined. otherwise there would be an error thrown already in the raw request
    return data as T;
  }
}

export async function rawRequest<T>(options: RequestOptions & { url: string }): Promise<GraphQLResponse<T>> {
  const client = new GraphQLClient(options.url);
  return client.rawRequest<T>(options);
}

export async function request<T>(options: RequestOptions & { url: string }): Promise<T> {
  const client = new GraphQLClient(options.url);
  return client.request<T>(options);
}

async function getResult<T>(response: Response): Promise<GraphQLResponse<T> | string> {
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.startsWith('application/json')) {
    const result = await response.json();
    return result as GraphQLResponse<T>;
  } else {
    return response.text();
  }
}
