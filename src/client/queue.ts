/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DiscordError, ErrorBody, isDiscordError } from './errors/discord-error';
import { RequestError } from './errors/request-error';
import { Manager } from './manager';
import { RequestMethod, Route } from './types';
import { parse } from './util/response';
import { OFFSET, ONE_HOUR, sleep } from './util/time';

export class Queue {
  lastRequest = -1;
  reset = -1;
  remaining = 1;
  limit = Infinity;
  manager: Manager;
  id: string;

  #queue: Promise<void>;
  #shutdownSignal?: AbortSignal | null;

  constructor(manager: Manager, id: string, shutdownSignal?: AbortSignal | null) {
    this.manager = manager;
    this.id = id;

    this.#queue = Promise.resolve();
    this.#shutdownSignal = shutdownSignal;
  }

  get inactive() {
    return Date.now() > this.lastRequest + 2 * ONE_HOUR;
  }

  isLocalLimited() {
    return this.remaining <= 0 && this.reset > Date.now();
  }

  getResetDelay() {
    return this.reset + OFFSET - Date.now();
  }

  async add(route: Route, resource: string, init: RequestInit) {
    return new Promise((resolve, reject) => {
      void this.#queue.then(async () => {
        try {
          const value = await this.#process(route, resource, init);
          resolve(value);
        } catch (err: unknown) {
          reject(err);
        }
      });
    });
  }

  async #process(route: Route, resource: string, init: RequestInit, retries = 0): Promise<unknown> {
    await this.#rateLimitThrottle();

    // As the request goes out, update the global request counter
    if (this.manager.globalReset < Date.now()) {
      this.manager.globalReset = Date.now() + 1000;
      this.manager.globalRequestCounter = this.manager.config.globalRequestsPerSecond;
    }

    this.manager.globalRequestCounter -= 1;

    // Setup the timeout signal
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const signal = new AbortController();
    const abortTimeout = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      signal.abort();
    }, this.manager.config.timeout);
    const clearAbort = () => {
      clearTimeout(abortTimeout);
    };

    // @ts-ignore
    this.#shutdownSignal?.addEventListener('signal', clearAbort);

    // Callbacks
    this.manager.onRequest?.(route, resource, init, retries);

    let response: Response, request: Request;
    // Send the request
    try {
      request = new Request(resource, init);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      response = await fetch(request, { signal: signal.signal });
    } catch (error: unknown) {
      // Handle timeout aborts
      if (error instanceof Error && error.name === 'AbortError' && retries < this.manager.config.retries) {
        return await this.#process(route, resource, init, retries + 1);
      }

      throw error;
    } finally {
      // @ts-ignore
      this.#shutdownSignal?.removeEventListener('signal', clearAbort);
      clearAbort();
    }

    // Parse Rate Limit information
    let retryAfter = 0;

    const global = Boolean(response.headers.get('X-RateLimit-Global'));
    const key = response.headers.get('X-RateLimit-Bucket');

    const retry = response.headers.get('Retry-After');
    const reset = response.headers.get('X-RateLimit-Reset-After');
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');

    this.reset = reset ? 1000 * Number(reset) + Date.now() + OFFSET : Date.now();
    this.limit = limit ? Number(limit) : Infinity;
    this.remaining = remaining ? Number(remaining) : 1;

    if (retry != null) {
      retryAfter = Number(retry) * 1000 + OFFSET;
    }

    // Handle global rate limits
    if (global && retryAfter > 0) {
      this.manager.globalRequestCounter = 0;
      this.manager.globalReset = Date.now() + retryAfter;
    }

    // Update bucket hashes as needed
    const identifier = `${init.method}:${route.path}`;
    const inBucket = await this.manager.buckets.has(identifier);
    const ttl = reset ? Math.floor(Number(reset) + OFFSET) : OFFSET;

    if (key !== null && key !== undefined && key !== this.id) {
      console.debug({ message: `Received new bucket hash.`, id: this.id, key });

      await this.manager.buckets.set(
        identifier,
        {
          key,
          lastRequest: Date.now()
        },
        ttl
      );
    } else if (key != null && inBucket) {
      await this.manager.buckets.set(
        identifier,
        {
          key,
          lastRequest: Date.now()
        },
        ttl
      );
    }

    // Successful Requests
    if (response.ok) {
      return parse(response);
    }

    // Rate Limited Requests
    if (response.status === 429) {
      const rateLimitData = {
        retryAfter,
        bucket: this.id,
        url: resource,
        limit: this.limit,
        route: route.path,
        identifier: route.identifier,
        global,
        method: init.method as RequestMethod
      };

      this.manager.onRateLimit?.(rateLimitData);

      console.debug({ message: `Encountered 429 rate limit`, rateLimit: rateLimitData });
      await sleep(retryAfter, this.#shutdownSignal);

      // Don't bump retries for a non-server issue (the request is expected to succeed)
      return this.#process(route, resource, init, retries);
    }

    // If given a server error, retry the request
    if (response.status >= 500 && response.status < 600) {
      if (retries < this.manager.config.retries) {
        return this.#process(route, resource, init, retries + 1);
      }

      throw new RequestError(
        resource,
        init,
        // `response` has not yet been consumed by this point, it is safe to pass an uncloned version
        response,
        `Discord Server Error encountered: ${response.statusText}`
      );
    }

    // Handle non-ratelimited bad requests
    if (response.status >= 400 && response.status < 500) {
      // If we receive a 401 status code, it means the token we had is no longer valid.
      const isAuthRequest = new Headers(init.headers).has('Authorization');
      if (response.status === 401 && isAuthRequest) {
        this.manager.setToken(null);
      }

      // Handle unknown API errors
      const data: ErrorBody = await response.json();
      const label = isDiscordError(data) ? data.code : data.error;

      throw new DiscordError(label, data);
    }

    return response;
  }

  async #rateLimitThrottle() {
    while (this.manager.isGlobalLimited() || this.isLocalLimited()) {
      const isGlobal = this.manager.isGlobalLimited();

      // TODO: Make this use retryAfter
      const timeout = isGlobal ? this.manager.globalTimeout : this.getResetDelay();
      const delay = isGlobal ? (this.manager.globalDelay ?? this.manager.setGlobalDelay(timeout)) : sleep(timeout);

      if (isGlobal) {
        console.debug({ message: `Global rate limit reached.`, timeout });
      } else {
        console.debug({
          message: `Encountered a local rate limit. Waiting before continuing`,
          id: this.id,
          timeout
        });
      }

      await delay;
    }
  }
}
