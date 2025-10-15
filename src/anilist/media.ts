import { APIApplicationCommandOptionChoice, LocalizationMap } from 'discord-api-types/v10';
import { aniListRequest } from './anilist';
import { FIND_MEDIA_BY_ID } from './gql/find-media-by-id';
import { FIND_MEDIA_NAME } from './gql/find-media-name';
import { Media, MediaType, Query } from './gql/types';

export const findMediaById = async (options: {
  mediaId: number;
  mediaType: MediaType;
  executionContext: ExecutionContext;
}): Promise<Media | undefined> => {
  const { mediaId, mediaType, executionContext } = options;

  const variables = {
    mediaId,
    mediaType
  };

  try {
    const result = await aniListRequest<Query>({
      query: FIND_MEDIA_BY_ID,
      variables
    });
    return result.Media;
  } catch (error) {
    console.error({ message: `Error when finding media`, error });
  }
};

export const findMediaTitles = async (options: {
  search: string;
  mediaType?: MediaType;
}): Promise<APIApplicationCommandOptionChoice[]> => {
  const { search, mediaType } = options;

  const variables = {
    search,
    mediaType
  };

  try {
    const result = await aniListRequest<Query>({
      query: FIND_MEDIA_NAME,
      variables
    });
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
