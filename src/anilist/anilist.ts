import { GraphQLClient } from '@graphql/client.js';

const ANILIST_ENDPOINT = `https://graphql.anilist.co/`;

export enum MediaType {
  ANIME = 'ANIME',
  MANGA = 'MANGA',
}

export enum MediaFormat {
  MANGA = 'MANGA',
  MOVIE = 'MOVIE',
  MUSIC = 'MUSIC',
  NOVEL = 'NOVEL',
  ONA = 'ONA',
  ONE_SHOT = 'ONE_SHOT',
  OVA = 'OVA',
  SPECIAL = 'SPECIAL',
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
}

export enum MediaSeason {
  FALL = 'FALL',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  WINTER = 'WINTER',
}

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
