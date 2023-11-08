import { GraphQLClient } from '@graphql/client.js';

const ANILIST_ENDPOINT = `https://graphql.anilist.co/`;

type Variables = {
  [key: string]: any;
};

const graphQlClient = new GraphQLClient(ANILIST_ENDPOINT);

export const aniListRequest = <T>(query: string, variables: Variables, cacheTtl: number = 10): Promise<T> => {
  return graphQlClient.request<T>(query, variables, {
    cache: cacheTtl > 0,
    cacheTtl,
  });
};
