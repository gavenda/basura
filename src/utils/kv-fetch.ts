import { sleep } from './sleep';

// KEYS used in the KV store
const KV_KEY_LIMIT = 'rate_limit_limit';
const KV_KEY_REMAINING = 'rate_limit_remaining';
const KV_KEY_RESET = 'rate_limit_reset';

/**
 * A rate-limited fetch function for a Cloudflare Worker using KV for state.
 *
 * NOTE: This is a simplified implementation. Real-world solutions might
 * use a dedicated rate-limiting service or a more robust atomic counter.
 *
 * @param {Request} url - The original request object from the Worker handler.
 * @param {Env} env - The environment object containing KV bindings.
 * @param {Env} init - Fetch options
 * @returns {Promise<Response>} The fetch response or a 429 error response.
 */
export async function kvRateLimitedFetch(
  url: RequestInfo | URL,
  env: Env,
  init?: RequestInit<RequestInitCfProperties>,
  attempt = 1
): Promise<Response> {
  // Check Pre-emptive Limit (based on previous call's headers)
  const nowInSeconds = Math.floor(Date.now() / 1000);

  const remainingStr = await env.KV.get(KV_KEY_REMAINING);
  const resetStr = await env.KV.get(KV_KEY_RESET);
  const limitStr = await env.KV.get(KV_KEY_LIMIT);

  let remaining = parseInt(remainingStr || '0', 10);
  let reset = parseInt(resetStr || '0', 10);
  let limit = parseInt(limitStr || '0', 10);

  // Check if we are past the server's known reset time
  if (remaining === 0 && reset > nowInSeconds) {
    const waitTimeMs = (reset - nowInSeconds) * 1000 + 500; // +500ms buffer
    console.warn({ message: `Limit hit on previous call. Waiting ${Math.ceil(waitTimeMs / 1000)}s` });
    await sleep(waitTimeMs);

    // Assume reset occurred and try again
    remaining = limit;
  }

  // Perform Fetch
  let response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    console.error({ message: `Failed to fetch`, error });
    // For demonstration, we break here, but production code might retry network errors.
    throw error;
  }

  // Update State
  limit = parseInt(response.headers.get('X-RateLimit-Limit') || '0', 10);
  remaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0', 10);
  reset = parseInt(response.headers.get('X-RateLimit-Reset') || '0', 10);

  void env.KV.put(KV_KEY_LIMIT, limit.toString(), { expiration: reset });
  void env.KV.put(KV_KEY_REMAINING, remaining.toString(), { expiration: reset });
  void env.KV.put(KV_KEY_RESET, reset.toString(), { expiration: reset });

  // Handle 429 Status
  if (response.status === 429) {
    let waitTimeMs = 0;
    const retryAfterSeconds = parseInt(response.headers.get('Retry-After') || '0', 10);

    if (!isNaN(retryAfterSeconds) && retryAfterSeconds > 0) {
      // Option A: Use Retry-After header (preferred)
      waitTimeMs = retryAfterSeconds * 1000 + 100; // Small buffer
      console.error({ message: `Server requested retry after ${retryAfterSeconds} seconds.` });
    } else if (reset > nowInSeconds) {
      // Option B: Use X-RateLimit-Reset timestamp
      waitTimeMs = (reset - nowInSeconds) * 1000 + 500; // Small buffer
      console.error({ message: `Using X-RateLimit-Reset time. Waiting ${Math.ceil(waitTimeMs / 1000)}s.` });
    } else {
      // Option C: Exponential backoff as a fallback (Should not happen if headers are present)
      waitTimeMs = Math.pow(2, attempt) * 1000;
      console.error({ message: `No explicit wait time. Falling back to exponential backoff: ${waitTimeMs}ms.` });
    }

    await sleep(waitTimeMs);

    // Go to the next retry attempt
    return kvRateLimitedFetch(url, env, init, attempt + 1);
  }

  if (!response.ok) {
    const data = await response.json();
    console.error({ message: 'Error response', data });
  }

  // Success or Non-429 Error
  return response;
}
