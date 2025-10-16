import {
  APIApplicationCommandOptionChoice,
  APIComponentInContainer,
  APIComponentInMessageActionRow,
  APIMessageTopLevelComponent,
  APITextDisplayComponent,
  ButtonStyle,
  ComponentType,
  Locale,
  LocalizationMap
} from 'discord-api-types/v10';
import { NodeHtmlMarkdown } from 'node-html-markdown-cloudflare';
import { toStars } from '../utils/anilist';
import { limitTextByParagraphs, titleCase, truncate } from '../utils/strings';
import { aniListRequest } from './anilist';
import { findMediaByIdQuery } from './gql/find-media-by-id';
import { findMediaListByUserIdsAndMediaIdQuery } from './gql/find-media-list-by-userids-and-mediaid';
import { findMediaTitleQuery } from './gql/find-media-title';
import { Media, MediaList, MediaListStatus, MediaRankType, MediaType, Query } from './gql/types';

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

export const findMediaListByUserIdsAndMediaId = async (options: {
  mediaId: number;
  userIds: number[];
  env: Env;
}): Promise<MediaList[] | undefined> => {
  const { mediaId, userIds, env } = options;

  const variables = {
    mediaId,
    userIds
  };

  try {
    const result = await aniListRequest<Query>({
      query: findMediaListByUserIdsAndMediaIdQuery,
      variables,
      env
    });

    return result.Page?.mediaList;
  } catch (error) {
    console.error({ message: `Error when finding media list`, error });
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
        const title = truncate(
          media.title.english ? `${media.title.romaji} (${media.title.english})` : media.title.romaji,
          100
        );
        const exists = titles.find((x) => x.name === title);

        if (exists) continue;

        const name_localizations: LocalizationMap = {};

        if (media.title.native) {
          const nativeTitle = truncate(media.title.native, 100);

          if (media.countryOfOrigin === 'KR') {
            name_localizations[Locale.Korean] = nativeTitle;
          }
          if (media.countryOfOrigin === 'CN') {
            name_localizations[Locale.ChineseCN] = nativeTitle;
            name_localizations[Locale.ChineseTW] = nativeTitle;
          }
          if (media.countryOfOrigin === 'JP') {
            name_localizations[Locale.Japanese] = nativeTitle;
          }
        }

        if (media.title.english) {
          const englishTitle = truncate(media.title.english, 100);

          name_localizations[Locale.EnglishGB] = englishTitle;
          name_localizations[Locale.EnglishUS] = englishTitle;
        }

        titles.push({
          name: title,
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

export const mediaToComponents = async (options: {
  media: Media;
  mediaList: MediaList[];
  nameMap: Record<number, string>;
}): Promise<APIMessageTopLevelComponent[]> => {
  const { media, mediaList, nameMap } = options;

  // TITLE START

  const titleComponents: APITextDisplayComponent[] = [];

  titleComponents.push({
    type: ComponentType.TextDisplay,
    content: `## ${media.title?.english || media.title?.romaji || media.title?.native}`
  });

  const altTitles: string[] = [];

  if (media.title?.english && media.title.romaji) {
    altTitles.push(`-# _(Romaji: ${media.title.romaji})_`);
  }

  if (media.title?.native) {
    altTitles.push(`-# _(Native: ${media.title.native})_`);
  }

  if (media.synonyms && media.synonyms.length > 0) {
    altTitles.push(`-# _(Synonym: ${media.synonyms[0]})_`);
  }

  if (altTitles.length > 0) {
    titleComponents.push({
      type: ComponentType.TextDisplay,
      content: altTitles.join('\n')
    });
  }

  // TITLE END

  // DETAILED INFO START

  const detailedInfo: string[] = [];

  if (media.status) {
    const status = titleCase(media.status.replaceAll('_', ' '));
    detailedInfo.push(status);
  }

  if (media.episodes) {
    detailedInfo.push(`${media.episodes} Episodes`);
  }

  if (media.chapters) {
    detailedInfo.push(`${media.chapters} Chapters`);
  }

  // DETAILED INFO END

  // TAGS START

  const actionRowComponents: APIComponentInMessageActionRow[] = [];

  if (media.format) {
    const format = media.format && media.format.length > 3 ? titleCase(media.format) : media.format;

    actionRowComponents.push({
      custom_id: 'media:format',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: format,
      disabled: true
    });
  }

  if (media.season && media.seasonYear) {
    actionRowComponents.push({
      custom_id: 'media:season',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: `${titleCase(media.season)} ${media.seasonYear}`,
      disabled: true
    });
  }

  if (media.rankings) {
    const mediaRankingsAsc = media.rankings.sort((a, b) => a.rank - b.rank);
    const allTimeRank = mediaRankingsAsc.find((x) => x.type === MediaRankType.RATED && x.allTime);
    const seasonRank = mediaRankingsAsc.find((x) => x.type === MediaRankType.RATED && !x.allTime && x.season);

    if (allTimeRank) {
      actionRowComponents.push({
        custom_id: 'media:rank',
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: `Rank #${allTimeRank.rank}`,
        disabled: true
      });
    }

    if (seasonRank && seasonRank.season) {
      // No all time rank, we add it as a tag
      if (!allTimeRank) {
        actionRowComponents.push({
          custom_id: 'media:rank',
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          label: `Rank #${seasonRank.rank} of ${titleCase(seasonRank.season)} ${seasonRank.year}`,
          disabled: true
        });
      } else {
        // Otherwise, add it to detailed info
        detailedInfo.push(`Rank #${seasonRank.rank} of ${titleCase(seasonRank.season)} ${seasonRank.year}`);
      }
    }
  }

  if (media.favourites) {
    actionRowComponents.push({
      custom_id: 'media:favorite',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: `❤️ ${media.favourites}`,
      disabled: true
    });
  }

  if (media.meanScore && media.meanScore != 0) {
    // footerInfo.push(`Rating - ${media.meanScore} / 100`);
    actionRowComponents.push({
      custom_id: 'media:rating',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: `${toStars(media.meanScore)}`,
      disabled: true
    });
  }

  // TAGS END

  // DESCRIPTION START

  const sourceRegex = /^(\(Source: .*\))$/gm;

  const descriptions: string[] = [];

  // Apply hashtag
  if (media.hashtag) {
    descriptions.push(`-# ${media.hashtag}`);
  }

  if (media.description) {
    descriptions.push(
      NodeHtmlMarkdown.translate(media.description).replaceAll(sourceRegex, (replace) => `-# ${replace}`)
    );
  } else {
    descriptions.push('No description available.');
  }

  // DESCRIPTIONS END

  // DETAILS START

  const details: string[] = [];

  // Add source
  if (media.source) {
    const source = `${titleCase(media.source?.replaceAll('_', ' '))}`;
    details.push(`-# Original Source\n${source}`);
  }

  // Add genres
  if (media.genres && media.genres.length > 0) {
    const genres = `${media.genres.map((x) => `${x}`).join(` - `)}`;
    details.push(`-# Genres\n${genres}`);
  }

  // Add characters
  if (media.characters?.edges && media.characters?.edges.length > 0) {
    const characters: string[] = [];

    for (const characterEdge of media.characters?.edges) {
      const character = characterEdge.node;

      if (character) {
        const name = character.name?.full;
        const nativeName = character.name?.native;
        const role = titleCase(characterEdge.role);

        characters.push(`- [${name}](${character.siteUrl}) (${nativeName}) - ${role}`);
      }
    }

    details.push(`-# Characters\n${characters.join('\n')}`);
  }

  // Add media list
  // User statuses operations
  const completed: string[] = [];
  const planned: string[] = [];
  const inProgress: string[] = [];
  const paused: string[] = [];
  const dropped: string[] = [];
  const repeating: string[] = [];

  const mediaListFiltered = mediaList
    .filter((mediaList) => mediaList.mediaId === media.id)
    .map((mediaList) => {
      return {
        discordName: nameMap[mediaList.userId],
        status: mediaList.status,
        score: mediaList.score,
        progress: mediaList.progress
      };
    });

  const mediaListSorted = mediaListFiltered?.sort(
    (a, b) => (a.progress || 0) - (b.progress || 0) || a.discordName.localeCompare(b.discordName)
  );

  if (mediaListSorted) {
    for (const mediaList of mediaListSorted) {
      const scoreStr = mediaList.score === 0 ? 'Unrated' : `${mediaList.score}`;
      const score = mediaList.score && mediaList.score > 0 ? `(Score: ${scoreStr})` : '';
      const progress = `[Progress: ${mediaList.progress}]`;

      switch (mediaList.status) {
        case MediaListStatus.COMPLETED: {
          completed.push(`- ${mediaList.discordName} ${score}`);
          break;
        }
        case MediaListStatus.CURRENT: {
          inProgress.push(`- ${mediaList.discordName} ${score} ${progress}`);
          break;
        }
        case MediaListStatus.DROPPED: {
          dropped.push(`- ${mediaList.discordName} ${score} ${progress}`);
          break;
        }
        case MediaListStatus.PAUSED: {
          paused.push(`- ${mediaList.discordName} ${score} ${progress}`);
          break;
        }
        case MediaListStatus.PLANNING: {
          planned.push(`- ${mediaList.discordName}`);
          break;
        }
        case MediaListStatus.REPEATING: {
          repeating.push(`- ${mediaList.discordName} ${score} ${progress}`);
          break;
        }
      }
    }
  }

  // User scores
  if (paused.length > 0) {
    details.push(`-# Paused\n${paused.join('\n')}`);
  }

  if (inProgress.length > 0) {
    details.push(`-# In Progress\n${inProgress.join('\n')}`);
  }

  if (repeating.length > 0) {
    details.push(`-# Repeating\n${repeating.join('\n')}`);
  }

  if (completed.length > 0) {
    details.push(`-# Completed\n${completed.join('\n')}`);
  }

  if (dropped.length > 0) {
    details.push(`-# Dropped\n${dropped.join('\n')}`);
  }

  if (planned.length > 0) {
    details.push(`-# Planned\n${planned.join('\n')}`);
  }

  // DESCRIPTION END

  // CONTAINER START

  const components: APIComponentInContainer[] = [];

  // Banner Image, if applicable
  if (media.bannerImage) {
    components.push({
      type: ComponentType.MediaGallery,
      items: [
        {
          media: {
            url: media.bannerImage
          }
        }
      ]
    });
  }

  // Title
  components.push({
    type: ComponentType.Section,
    components: titleComponents,
    accessory: {
      type: ComponentType.Button,
      style: ButtonStyle.Link,
      label: 'AniList',
      url: `${media.siteUrl}`
    }
  });

  // Detailed Info
  components.push({
    type: ComponentType.TextDisplay,
    content: `-# ${detailedInfo.join(` — `)}`
  });

  // Tags
  if (actionRowComponents.length > 0) {
    components.push({
      type: ComponentType.ActionRow,
      components: actionRowComponents
    });
  }

  // Seperator
  components.push({
    type: ComponentType.Separator
  });

  // Description
  components.push({
    type: ComponentType.Section,
    components: [
      {
        type: ComponentType.TextDisplay,
        content: limitTextByParagraphs(descriptions.join('\n\n'), 2000)
      }
    ],
    accessory: {
      type: ComponentType.Thumbnail,
      media: {
        url: `${media.coverImage?.extraLarge}`
      }
    }
  });

  components.push({
    type: ComponentType.TextDisplay,
    content: details.join('\n\n')
  });

  return [
    {
      type: ComponentType.Container,
      components
    }
  ];
};
