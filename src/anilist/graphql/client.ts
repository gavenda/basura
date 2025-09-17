import { ClientError, GraphQLResponse, Headers as HttpHeaders, Options, Variables } from './types';
export { ClientError } from './types';

export class GraphQLClient {
  private url: string;
  private options: Options;

  constructor(url: string, options?: Options) {
    this.url = url;
    this.options = options || {};
  }

  async rawRequest<T>(
    query: string,
    variables?: Variables,
    options: {
      cache: boolean;
      cacheKey?: string;
      cacheTtl?: number;
    } = {
      cache: false
    }
  ): Promise<GraphQLResponse<T>> {
    if (options.cache && !options.cacheTtl) {
      throw new Error('GraphQLClient request: cache is set true but no cacheTtl is specified.');
    }

    const { headers, ...others } = this.options;

    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined
    });

    let response: Response | undefined;

    if (options.cache) {
      response = await fetch(this.url, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
        body,
        cf: {
          // Always cache this fetch regardless of content type
          // for a max of 5 seconds before revalidating the resource
          cacheTtl: options.cacheTtl,
          cacheEverything: options.cache,
          //Enterprise only feature, see Cache API for other plans
          cacheKey: options.cacheKey
        },
        ...others
      });
      response = new Response(response.body, response);
      response.headers.append('Cache-Control', `max-age=${options.cacheTtl}`);
    } else {
      response = await fetch(this.url, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
        body,
        ...others
      });
    }

    const result = await getResult<T>(response);

    if (response.ok && typeof result !== 'string') {
      return result;
    } else {
      const errorResult = { error: result };
      throw new ClientError(
        { ...errorResult, status: response.status, headers: response.headers },
        { query, variables }
      );
    }
  }

  async request<T>(
    query: string,
    variables?: Variables,
    options: {
      cache: boolean;
      cacheKey?: string;
      cacheTtl?: number;
    } = {
      cache: false
    }
  ): Promise<T> {
    const { data } = await this.rawRequest<T>(query, variables, options);

    // we cast data to T here as it will be defined. otherwise there would be an error thrown already in the raw request
    return data as T;
  }

  setHeaders(headers: HttpHeaders): GraphQLClient {
    this.options.headers = headers;

    return this;
  }

  setHeader(key: string, value: string): GraphQLClient {
    const { headers } = this.options;

    if (headers) {
      headers[key] = value;
    } else {
      this.options.headers = { [key]: value };
    }
    return this;
  }
}

export async function rawRequest<T>(url: string, query: string, variables?: Variables): Promise<GraphQLResponse<T>> {
  const client = new GraphQLClient(url);
  return client.rawRequest<T>(query, variables);
}

export async function request<T>(url: string, query: string, variables?: Variables): Promise<T> {
  const client = new GraphQLClient(url);

  return client.request<T>(query, variables);
}

async function getResult<T>(response: Response): Promise<GraphQLResponse<T> | string> {
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.startsWith('application/json')) {
    const result = await response.json();
    return result as GraphQLResponse<T>;
  } else {
    return response.text();
  }
}
