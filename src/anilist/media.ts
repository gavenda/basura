import { MediaSeason, MediaFormat, aniListRequest, MediaType } from './anilist.js';
import { FIND_MEDIA_BY_RANKING } from './gql/find-media-by-ranking.js';
import { FIND_MEDIA_NAME } from './gql/find-media-name.js';
import { FIND_MEDIA } from './gql/find-media.js';

export interface FindMediaVars {
  query: string;
  type: MediaType;
  page: number;
  perPage: number;
  sort: string[];
  season: MediaSeason;
  seasonYear: number;
  formatIn: MediaFormat[];
  genreNotIn: string[];
}

export const findMedia = async (query: string, type: MediaType, hentai: boolean): Promise<any> => {
  const variables: Partial<FindMediaVars> = {
    query,
    type,
    page: 1,
    perPage: 10,
  };

  if (!hentai) {
    variables.genreNotIn = ['hentai'];
  }

  try {
    const result = await aniListRequest<any>(FIND_MEDIA, variables);
    return result.Page?.media;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const findMediaByRanking = async (
  amount: number = 10,
  formatIn: MediaFormat[],
  season: MediaSeason,
  seasonYear: number,
  hentai: Boolean
): Promise<any> => {
  const variables: Partial<FindMediaVars> = {
    page: 1,
    perPage: amount,
    sort: ['DESC'],
    formatIn,
    season,
    seasonYear,
  };

  if (!hentai) {
    variables.genreNotIn = ['hentai'];
  }

  try {
    const result = await aniListRequest<any>(FIND_MEDIA_BY_RANKING, variables);
    return result.Page?.media;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const findMediaTitles = async (query: string, type: MediaType): Promise<any> => {
  const variables: Partial<FindMediaVars> = {
    query,
    type,
    page: 1,
    perPage: 10,
  };

  try {
    const result = await aniListRequest<any>(FIND_MEDIA_NAME, variables);
    return result.Page?.media;
  } catch (err) {
    console.error(err);
    return null;
  }
};
