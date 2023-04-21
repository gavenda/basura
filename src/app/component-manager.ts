import { Component } from './component.js';

export class ComponentManager {
  cache: KVNamespace;

  constructor(cache: KVNamespace) {
    this.cache = cache;
  }

  async createComponent(id: string, context: string, data: any): Promise<void> {
    const component = new Component(id, context, data);
    await this.cache.put(component.key, JSON.stringify(data));
  }

  async getComponentData(key: string): Promise<any> {
    return await this.cache.get(key, 'json');
  }
}
