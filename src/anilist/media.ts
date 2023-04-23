import { aniListRequest } from './anilist.js';
import { FIND_MEDIA_BY_RANKING } from './gql/find-media-by-ranking.js';
import { FIND_MEDIA_NAME } from './gql/find-media-name.js';
import { FIND_MEDIA } from './gql/find-media.js';
import { FIND_SCORE_BY_MEDIA_ID_AND_USER_ID } from './gql/find-score-by-media-id-and-user-id.js';
import { Media, MediaFormat, MediaList, MediaSeason, MediaType, Query } from './gql/types.js';

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

export const findMedia = async (query: string, type?: MediaType, hentai: boolean = true): Promise<Media[] | undefined> => {
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
    const result = await aniListRequest<Query>(FIND_MEDIA, variables);
    return result.Page?.media;
  } catch (err) {
    console.error(err);
  }
};

export const findMediaByRanking = async (amount: number = 10, formatIn: MediaFormat[], season: MediaSeason, seasonYear: number, hentai: Boolean): Promise<Media[] | undefined> => {
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
    const result = await aniListRequest<Query>(FIND_MEDIA_BY_RANKING, variables);
    return result.Page?.media;
  } catch (err) {
    console.error(err);
  }
};

export const findMediaTitles = async (query: string, type?: MediaType): Promise<string[]> => {
  const variables: Partial<FindMediaVars> = {
    query,
    type,
    page: 1,
    perPage: 10,
  };

  try {
    const result = await aniListRequest<Query>(FIND_MEDIA_NAME, variables);
    const medias = result.Page?.media ?? [];
    const titles: string[] = [];
    for (const media of medias) {
      if (media?.title?.native) {
        titles.push(media.title.native);
      }
      if (media?.title?.romaji) {
        titles.push(media.title.romaji);
      }
      if (media?.title?.english) {
        titles.push(media.title.english);
      }
      if (media.synonyms) {
        titles.push(...media.synonyms);
      }
    }

    return titles;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const findScoreByUsersAndMedias = async (userIds: number[], mediaIds: number[]): Promise<MediaList[] | undefined> => {
  const variables = { userIds, mediaIds };

  try {
    const result = await aniListRequest<Query>(FIND_SCORE_BY_MEDIA_ID_AND_USER_ID, variables);
    return result.Page?.mediaList;
  } catch (err) {
    console.error(err);
  }
};
