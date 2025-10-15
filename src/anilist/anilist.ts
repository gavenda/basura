import { GraphQLClient } from './graphql/client';

const ANILIST_ENDPOINT = `https://graphql.anilist.co/`;

type Variables = {
  [key: string]: unknown;
};

const graphQlClient = new GraphQLClient(ANILIST_ENDPOINT);

export const aniListRequest = <T>(options: { query: string; variables: Variables }): Promise<T> => {
  return graphQlClient.request<T>(options);
};
