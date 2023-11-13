export interface Cache {
  get<T>(key: string): Promise<T | null>;
  put<T>(key: string, value: T): Promise<void>;
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
