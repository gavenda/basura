import { Redis } from '@upstash/redis/cloudflare';

export interface Cache {
  get<T>(key: string): Promise<T | null>;
  put<T>(key: string, value: T): Promise<void>;
}

export class RedisCache implements Cache {
  client: Redis;
  ttl: number;

  constructor(client: Redis, ttl: number) {
    this.client = client;
    this.ttl = ttl;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.client.get<T>(key);
  }

  async put<T>(key: string, value: T): Promise<void> {
    await this.client.set(key, value, {
      // Expiry
      ex: this.ttl,
    });
  }
}

export class DefaultCache implements Cache {
  map = new Map();

  async get<T>(key: string): Promise<T | null> {
    return this.map.get(key) as T;
  }

  async put<T>(key: string, value: T): Promise<void> {
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
  async get<T>(key: string): Promise<T | null> {
    return this.cache.get<T>(key, 'json');
  }

  async put<T>(key: string, value: T): Promise<void> {
    await this.cache.put(key, JSON.stringify(value), {
      expirationTtl: this.ttl > 60 ? this.ttl : 60,
    });
  }
}
