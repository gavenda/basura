export type Variables = { [key: string]: any };

export interface Headers {
  [key: string]: string;
}

export interface Options {
  method?: RequestInit['method'];
  headers?: Headers;
  redirect?: RequestInit['redirect'];
  integrity?: RequestInit['integrity'];
}

export interface GraphQLError {
  message: string;
  locations: { line: number; column: number }[];
  path: string[];
}

export interface GraphQLResponse {
  data?: any;
  errors?: GraphQLError[];
  extensions?: any;
  status: number;
  [key: string]: any;
}

export interface GraphQLRequestContext {
  query: string;
  variables?: Variables;
}

export class ClientError extends Error {
  response: GraphQLResponse;
  request: GraphQLRequestContext;

  constructor(response: GraphQLResponse, request: GraphQLRequestContext) {
    const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({ response, request })}`;

    super(message);

    this.response = response;
    this.request = request;

		Error.captureStackTrace(this, ClientError);
  }

  private static extractMessage(response: GraphQLResponse): string {
    try {
      return response.errors![0].message;
    } catch (e) {
      return `GraphQL Error (Code: ${response.status})`;
    }
  }
}
