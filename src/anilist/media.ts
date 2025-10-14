import { APIApplicationCommandOptionChoice, LocalizationMap } from 'discord-api-types/v10';
import { aniListRequest } from './anilist';
import { FIND_MEDIA_BY_ID } from './gql/find-media-by-id';
import { FIND_MEDIA_NAME } from './gql/find-media-name';
import { Media, MediaType, Query } from './gql/types';

export interface FindMediaVars {
  query: string;
  page: number;
  perPage: number;
  mediaId: number;
  mediaType: MediaType;
  genreNotIn: string[];
}

export const findMediaById = async (mediaId: number, mediaType: MediaType): Promise<Media | undefined> => {
  const variables: Partial<FindMediaVars> = {
    mediaId,
    mediaType
  };

  try {
    const result = await aniListRequest<Query>(FIND_MEDIA_BY_ID, variables);
    return result.Media;
  } catch (error) {
    console.error({ message: `Error when finding media`, error });
  }
};

export const findMediaTitles = async (
  query: string,
  mediaType?: MediaType,
  hentai: boolean = false
): Promise<APIApplicationCommandOptionChoice[]> => {
  const variables: Partial<FindMediaVars> = {
    query,
    mediaType,
    page: 1,
    perPage: 25
  };

  if (!hentai) {
    variables.genreNotIn = ['hentai'];
  }

  try {
    const result = await aniListRequest<Query>(FIND_MEDIA_NAME, variables);
    const medias = result.Page?.media ?? [];
    const titles: APIApplicationCommandOptionChoice[] = [];

    for (const media of medias) {
      const name_localizations: LocalizationMap | null = {};

      if (media?.title?.native) {
        name_localizations['ja'] = media.title.native;
      }

      if (media?.title?.english) {
        name_localizations['en-US'] = media.title.english;
      }

      if (media?.title?.romaji) {
        titles.push({
          name: media.title.english ? `${media.title.romaji} (${media.title.english})` : media.title.romaji,
          name_localizations,
          value: media.id
        });
      }
    }

    return titles;
  } catch (error) {
    console.error({ message: `Error when finding media titles`, error });
    return [];
  }
};
