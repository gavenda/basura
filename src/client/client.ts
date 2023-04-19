import { Callbacks, Manager, ManagerArgs } from './manager.js';
import { RequestData, RequestMethod, RequestOptions } from './types.js';

export class Client {
  #manager: Manager;

  constructor(options: ManagerArgs = {}) {
    this.#manager = new Manager(options);
  }

  setToken(token: string) {
    this.#manager.setToken(token);
    return this;
  }

  get userAgent() {
    return this.#manager.config.userAgent;
  }

  set userAgent(value: string) {
    this.#manager.config.userAgent = value;
  }

  get abortSignal() {
    return this.#manager.shutdownSignal;
  }

  set abortSignal(signal: AbortSignal | null | undefined) {
    this.#manager.shutdownSignal = signal;
  }

  get globalRequestsPerSecond() {
    return this.#manager.config.globalRequestsPerSecond;
  }

  set globalRequestsPerSecond(value: number) {
    this.#manager.config.globalRequestsPerSecond = value;
  }

  get api() {
    return {
      api: this.#manager.config.api,
      version: this.#manager.config.version,
      cdn: this.#manager.config.cdn,
    };
  }

  set api({ api, version, cdn }: { api: string; version: number; cdn: string }) {
    this.#manager.config.api = api;
    this.#manager.config.version = version;
    this.#manager.config.cdn = cdn;
  }

  get requestConfig() {
    return {
      headers: this.#manager.config.headers,
      retries: this.#manager.config.retries,
      timeout: this.#manager.config.timeout,
    };
  }

  set requestConfig({
    headers,
    retries,
    timeout,
  }: {
    headers: Record<string, string>;
    retries: number;
    timeout: number;
  }) {
    this.#manager.config.headers = headers;
    this.#manager.config.retries = retries;
    this.#manager.config.timeout = timeout;
  }

  get sweepIntervals() {
    return {
      bucketSweepInterval: this.#manager.bucketSweepInterval,
      queueSweepInterval: this.#manager.queueSweepInterval,
    };
  }

  set sweepIntervals({
    bucketSweepInterval,
    queueSweepInterval,
  }: {
    bucketSweepInterval: number;
    queueSweepInterval: number;
  }) {
    this.#manager.bucketSweepInterval = bucketSweepInterval;
    this.#manager.queueSweepInterval = queueSweepInterval;
  }

  get callbacks() {
    return {
      onBucketSweep: this.#manager.onBucketSweep,
      onQueueSweep: this.#manager.onQueueSweep,
      onRateLimit: this.#manager.onRateLimit,
      onRequest: this.#manager.onRequest,
    };
  }

  set callbacks({
    onBucketSweep,
    onQueueSweep,
    onRateLimit,
    onRequest,
  }: {
    onBucketSweep?: Callbacks['onBucketSweep'];
    onQueueSweep?: Callbacks['onQueueSweep'];
    onRateLimit?: Callbacks['onRateLimit'];
    onRequest?: Callbacks['onRequest'];
  }) {
    this.#manager.onBucketSweep = onBucketSweep;
    this.#manager.onQueueSweep = onQueueSweep;
    this.#manager.onRateLimit = onRateLimit;
    this.#manager.onRequest = onRequest;
  }

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.#request({
      path,
      method: RequestMethod.Get,
      ...options,
    }) as Promise<T>;
  }

  async post<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.#request({
      path,
      method: RequestMethod.Post,
      ...options,
    }) as Promise<T>;
  }

  async put<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.#request({
      path,
      method: RequestMethod.Put,
      ...options,
    }) as Promise<T>;
  }

  async patch<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.#request({
      path,
      method: RequestMethod.Patch,
      ...options,
    }) as Promise<T>;
  }

  async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.#request({
      path,
      method: RequestMethod.Delete,
      ...options,
    }) as Promise<T>;
  }

  async #request(data: RequestData) {
    return this.#manager.queue(data);
  }
}
