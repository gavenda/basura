import { APIApplicationCommandOptionChoice, LocalizationMap } from 'discord-api-types/v10';
import { truncate } from '../utils/strings';
import { aniListRequest } from './anilist';
import { findMediaByIdQuery } from './gql/find-media-by-id';
import { findMediaTitleQuery } from './gql/find-media-title';
import { Media, MediaType, Query } from './gql/types';

export const findMediaById = async (options: {
  mediaId: number;
  mediaType: MediaType;
  env: Env;
}): Promise<Media | undefined> => {
  const { mediaId, mediaType, env } = options;

  const variables = {
    mediaId,
    mediaType
  };

  try {
    const result = await aniListRequest<Query>({
      query: findMediaByIdQuery,
      variables,
      env
    });
    return result.Media;
  } catch (error) {
    console.error({ message: `Error when finding media`, error });
  }
};

export const findMediaTitles = async (options: {
  search: string;
  mediaType?: MediaType;
  env: Env;
}): Promise<APIApplicationCommandOptionChoice[]> => {
  const { search, mediaType, env } = options;

  const variables = {
    search,
    mediaType
  };

  try {
    const result = await aniListRequest<Query>({
      query: findMediaTitleQuery,
      variables,
      env
    });
    const medias = result.Page?.media ?? [];
    const titles: APIApplicationCommandOptionChoice[] = [];

    for (const media of medias) {
      if (media?.title?.romaji) {
        const title = media.title.english ? `${media.title.romaji} (${media.title.english})` : media.title.romaji;
        const safeTitle = truncate(title, 100);
        const exists = titles.find((x) => x.name === safeTitle);

        if (exists) continue;

        const name_localizations: LocalizationMap = {};

        if (media.title.native) {
          name_localizations['ja'] = truncate(media.title.native, 100);
        }

        if (media.title.english) {
          name_localizations['en-US'] = truncate(media.title.english, 100);
        }

        titles.push({
          name: safeTitle,
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
