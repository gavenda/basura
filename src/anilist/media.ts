import { logger } from '@logger/logger';
import { aniListRequest } from './anilist.js';
import { FIND_AIRING_MEDIA } from './gql/find-airing-media.js';
import { FIND_MEDIA_BY_RANKING } from './gql/find-media-by-ranking.js';
import { FIND_MEDIA_NAME } from './gql/find-media-name.js';
import { FIND_MEDIA } from './gql/find-media.js';
import { FIND_SCORE_BY_MEDIA_ID_AND_USER_ID } from './gql/find-score-by-media-id-and-user-id.js';
import { AiringSchedule, Media, MediaFormat, MediaList, MediaSeason, MediaSort, MediaType, Query } from './gql/types.js';

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
  mediaId: number;
}

export const findAiringMedia = async (mediaId: number): Promise<AiringSchedule[] | undefined> => {
  const variables: Partial<FindMediaVars> = {
    mediaId,
  };

  try {
    const result = await aniListRequest<Query>(FIND_AIRING_MEDIA, variables);
    return result.Page?.airingSchedules;
  } catch (error) {
    logger.error(`Error when finding airing media`, { error });
  }
};

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
  } catch (error) {
    logger.error(`Error when finding media`, { error });
  }
};

export const findMediaByRanking = async (options: {
  amount: number;
  formatIn: MediaFormat[];
  season?: MediaSeason;
  seasonYear?: number;
  hentai?: Boolean;
}): Promise<Media[] | undefined> => {
  const variables: Partial<FindMediaVars> = {
    page: 1,
    perPage: options.amount,
    sort: [MediaSort.SCORE_DESC],
    formatIn: options.formatIn,
    season: options.season,
    seasonYear: options.seasonYear,
  };

  if (!options.hentai) {
    variables.genreNotIn = ['hentai'];
  }

  try {
    const result = await aniListRequest<Query>(FIND_MEDIA_BY_RANKING, variables);
    return result.Page?.media;
  } catch (error) {
    logger.error(`Error when finding media by ranking`, { error });
  }
};

export const findMediaIds = async (query: string, type?: MediaType): Promise<Media[]> => {
  const variables: Partial<FindMediaVars> = {
    query,
    type,
    page: 1,
    perPage: 10,
  };

  try {
    const result = await aniListRequest<Query>(FIND_MEDIA_NAME, variables);
    return result.Page?.media || [];
  } catch (error) {
    logger.error(`Error when finding media ids`, { error });
    return [];
  }
};

export const findMediaTitles = async (query: string, type?: MediaType): Promise<string[]> => {
  const variables: Partial<FindMediaVars> = {
    query,
    type,
    page: 1,
    perPage: 25,
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
  } catch (error) {
    logger.error(`Error when finding media titles`, { error });
    return [];
  }
};

export const findScoreByUsersAndMedias = async (userIds: number[], mediaIds: number[]): Promise<MediaList[] | undefined> => {
  const variables = { userIds, mediaIds };

  try {
    const result = await aniListRequest<Query>(FIND_SCORE_BY_MEDIA_ID_AND_USER_ID, variables);
    return result.Page?.mediaList;
  } catch (error) {
    logger.error(`Error when score by user and media`, { error });
  }
};
