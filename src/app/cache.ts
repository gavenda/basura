import { Awaitable } from '@util/awaitable';

export interface Cache {
  get<T>(key: string): Awaitable<T | null>;
  put<T>(key: string, value: T): Awaitable<void>;
}

export class DefaultCache implements Cache {
  map = new Map();

  get<T>(key: string) {
    return this.map.get(key) as T;
  }

  put<T>(key: string, value: T) {
    this.map.set(key, value);
  }
}

export class KVCache implements Cache {
  cache: KVNamespace;
  ttl: number;

  constructor(cache: KVNamespace, ttl: number) {
    this.cache = cache;
    this.ttl = ttl;
  }

  async get<T>(key: string) {
    return await this.cache.get<T>(key, 'json');
  }

  async put<T>(key: string, value: T) {
    await this.cache.put(key, JSON.stringify(value), {
      expirationTtl: this.ttl > 60 ? this.ttl : 60
    });
  }
}
