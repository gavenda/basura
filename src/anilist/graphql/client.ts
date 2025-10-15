import { safeFetch } from '../../utils/safe-fetch';
import { ClientError, GraphQLResponse, Variables } from './types';
export { ClientError } from './types';

export class GraphQLClient {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async rawRequest<T>(options: { query: string; variables?: Variables }): Promise<GraphQLResponse<T>> {
    const { query, variables } = options;
    const body = JSON.stringify({
      query,
      variables
    });

    const response = await safeFetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      cf: {
        // Always cache this fetch regardless of content type
        // for a max of 5 seconds before revalidating the resource
        cacheTtl: 60
      }
    });

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

  async request<T>(options: { query: string; variables?: Variables }): Promise<T> {
    const { data } = await this.rawRequest<T>(options);

    // we cast data to T here as it will be defined. otherwise there would be an error thrown already in the raw request
    return data as T;
  }
}

export async function rawRequest<T>(options: {
  url: string;
  query: string;
  variables?: Variables;
}): Promise<GraphQLResponse<T>> {
  const client = new GraphQLClient(options.url);
  return client.rawRequest<T>(options);
}

export async function request<T>(options: { url: string; query: string; variables?: Variables }): Promise<T> {
  const client = new GraphQLClient(options.url);
  return client.request<T>(options);
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
