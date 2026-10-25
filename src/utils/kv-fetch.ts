import { sleep } from './sleep';

const MAX_ATTEMPTS = 3;
// KV rejects TTLs under 60 seconds.
const KV_MIN_TTL_SECONDS = 60;

export interface RateLimitOptions {
  /**
   * When true (default), wait out a rate limit and retry.
   * When false, return a 429 right away. Use this for anything with a hard deadline,
   * like autocomplete, which Discord drops after 3 seconds.
   */
  wait?: boolean;
}

// Per-isolate copy of the block state, so most requests skip the KV read.
const blockedUntilCache = new Map<string, number>();

const kvKey = (host: string) => `rate_limit_blocked_until:${host}`;

const getBlockedUntil = async (env: Env, host: string): Promise<number> => {
  const cached = blockedUntilCache.get(host);
  if (cached && cached > Date.now()) return cached;

  const stored = parseInt((await env.KV.get(kvKey(host))) ?? '0', 10);
  if (stored > Date.now()) blockedUntilCache.set(host, stored);
  return stored;
};

const setBlockedUntil = async (env: Env, host: string, blockedUntil: number) => {
  blockedUntilCache.set(host, blockedUntil);

  const ttl = Math.max(KV_MIN_TTL_SECONDS, Math.ceil((blockedUntil - Date.now()) / 1000) + 1);
  try {
    await env.KV.put(kvKey(host), blockedUntil.toString(), { expirationTtl: ttl });
  } catch (error) {
    console.error({ message: 'Failed to store rate limit state', host, error });
  }
};

/** Works out when a 429 lifts, from Retry-After or X-RateLimit-Reset. */
const blockedUntilFrom = (response: Response, attempt: number): number => {
  const retryAfter = parseFloat(response.headers.get('Retry-After') ?? '');
  if (retryAfter > 0) return Date.now() + retryAfter * 1000 + 250;

  const reset = parseFloat(response.headers.get('X-RateLimit-Reset') ?? '');
  if (reset * 1000 > Date.now()) return reset * 1000 + 250;

  return Date.now() + Math.pow(2, attempt) * 1000;
};

const rateLimitedResponse = (blockedUntil: number) =>
  new Response(JSON.stringify({ errors: [{ message: 'Rate limited (local)', status: 429 }] }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': Math.ceil((blockedUntil - Date.now()) / 1000).toString()
    }
  });

/**
 * Fetch that respects rate limits per host, with state shared across isolates through KV.
 *
 * KV is only written when a 429 comes back, so normal traffic costs one KV read at most.
 */
export async function kvRateLimitedFetch(
  url: RequestInfo | URL,
  env: Env,
  init?: RequestInit<RequestInitCfProperties>,
  options: RateLimitOptions = {},
  attempt = 1
): Promise<Response> {
  const { wait = true } = options;
  const host = new URL(url instanceof Request ? url.url : url).host;

  // Skip the request entirely if we already know the host is blocking us.
  const blockedUntil = await getBlockedUntil(env, host);
  if (blockedUntil > Date.now()) {
    if (!wait) return rateLimitedResponse(blockedUntil);

    const waitMs = blockedUntil - Date.now();
    console.warn({ message: `Rate limited by ${host}, waiting ${Math.ceil(waitMs / 1000)}s` });
    await sleep(waitMs);
  }

  let response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    console.error({ message: `Failed to fetch`, error });
    throw error;
  }

  if (response.status === 429) {
    const until = blockedUntilFrom(response, attempt);
    await setBlockedUntil(env, host, until);
    console.error({ message: `Rate limited by ${host} until ${new Date(until).toISOString()}` });

    if (!wait || attempt >= MAX_ATTEMPTS) return response;

    await sleep(until - Date.now());
    return kvRateLimitedFetch(url, env, init, options, attempt + 1);
  }

  if (!response.ok && response.body && init) {
    const [stream1, stream2] = response.body.tee();
    const data = await new Response(stream1).text();

    console.error({ message: 'Error response', status: response.status, data, body: init.body });

    return new Response(stream2, response);
  }

  return response;
}
