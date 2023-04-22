import { v4 as uuidv4 } from 'uuid';
import { Cache } from './cache.js';

export class ComponentManager {
  cache: Cache;

  constructor(cache: Cache) {
    this.cache = cache;
  }

  async createComponent(id: string, context: string, data?: any): Promise<string> {
    const uniqueId = uuidv4();
    const key = `${context}:${id}:${uniqueId}`;
		if (data) {
			// Only put data if its not null, otherwise it would be pointless
			await this.cache.put(key, data);
		}
    return key;
  }

  async getComponentData(key: string): Promise<any> {
    return await this.cache.get(key);
  }
}
