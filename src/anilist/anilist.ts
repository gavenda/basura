import { request } from '@ninetailed/cf-worker-graphql-request';

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

export const aniListRequest = <T>(query: string, variables: Variables): Promise<T> => {
  return request<T>(ANILIST_ENDPOINT, query, variables);
};
