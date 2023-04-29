import { Bucket, BucketManager } from './manager.js';

/**
 * A KV version of the bucket manager.
 */
export class KVBucketManager implements BucketManager {
  kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  async list(): Promise<[string, Bucket][]> {
    const result = await this.kv.list();
    const buckets: [string, Bucket][] = [];

    for (const key of result.keys) {
      const bucket = await this.kv.get<Bucket>(key.name, 'json');
      if (bucket) {
        buckets.push([key.name, bucket]);
      }
    }

    return buckets;
  }
  async has(key: string): Promise<boolean> {
    return (await this.kv.get<Bucket>(key)) !== null;
  }
  async get(key: string): Promise<Bucket | undefined> {
    const bucket = await this.kv.get<Bucket>(key);
    if (bucket) {
      return bucket;
    }
  }
  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }
  async set(key: string, bucket: Bucket, ttl: number): Promise<void> {
    await this.kv.put(key, JSON.stringify(bucket), {
      expirationTtl: ttl > 60 ? ttl : 60,
    });
  }
}
