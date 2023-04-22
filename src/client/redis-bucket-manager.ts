import { Redis } from '@upstash/redis/cloudflare';
import { Bucket, BucketManager } from './manager.js';

/**
 * Redis version of the bucket manager. Can still be optimized. For now its using KEYS which is not recommended
 * when running on very large datasets.
 */
export class RedisBucketManager implements BucketManager {
  namespace: string;
  redis: Redis;

  constructor(redis: Redis, namespace = 'bucket') {
    this.redis = redis;
    this.namespace = namespace;
  }

  async list(): Promise<[string, Bucket][]> {
    const keys = await this.redis.keys(`${this.namespace}:*`);
    const buckets: [string, Bucket][] = [];

    for (const key of keys) {
      console.log(key);
      const bucket = await this.redis.get<Bucket>(key);
      if (bucket) {
        buckets.push([key.slice(this.namespace.length + 1), bucket]);
      }
    }

    return buckets;
  }
  async has(key: string): Promise<boolean> {
    console.log(`Checking bucket: ${key}`);
    return (await this.redis.get<Bucket>(`${this.namespace}:${key}`)) !== null;
  }
  async get(key: string): Promise<Bucket | undefined> {
    const bucket = await this.redis.get<Bucket>(`${this.namespace}:${key}`);
    if (bucket) {
      console.log(`Found existing bucket: ${key}`);
      return bucket;
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(`${this.namespace}:${key}`);
  }

  async set(key: string, bucket: Bucket): Promise<void> {
    await this.redis.set(`${this.namespace}:${key}`, bucket, {
      ex: 300,
    });
  }
}
