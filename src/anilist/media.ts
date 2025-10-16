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
import { titleCase, truncate } from '../utils/strings';
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

  let altTitles = '';

  if (media.title?.english && media.title.romaji) {
    altTitles = altTitles + `-# _(Romaji: ${media.title.romaji})_\n`;
  }

  if (media.title?.native) {
    altTitles = altTitles + `-# _(Native: ${media.title.native})_\n`;
  }

  if (media.synonyms && media.synonyms.length > 0) {
    altTitles = altTitles + `-# _(Synonym: ${media.synonyms[0]})_\n`;
  }

  if (altTitles.length > 0) {
    titleComponents.push({
      type: ComponentType.TextDisplay,
      content: altTitles
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

  let description = 'No synopsis available.';

  if (media.description) {
    description = NodeHtmlMarkdown.translate(media.description);
  }

  // Apply source regex
  description = description.replaceAll(sourceRegex, (replace) => `-# ${replace}`);

  // Apply hashtag
  if (media.hashtag) {
    description = `-# ${media.hashtag}\n\n${description}`;
  }

  // Add source
  if (media.source) {
    const source = titleCase(media.source?.replaceAll('_', ' '));
    description += `\n\n-# Original Source\n${source}`;
  }

  // Add genres
  if (media.genres && media.genres.length > 0) {
    const genres = `${media.genres.map((x) => `${x}`).join(` - `)}`;
    description += `\n\n-# Genres\n${genres}`;
  }

  // Add characters
  if (media.characters?.edges && media.characters?.edges.length > 0) {
    description += `\n\n-# Characters\n`;
    for (const characterEdge of media.characters?.edges) {
      const character = characterEdge.node;

      if (character) {
        description += `- [${character.name?.full}](${character.siteUrl}) (${character.name?.native}) - ${titleCase(characterEdge.role)}\n`;
      }
    }

    description = description.slice(0, -1);
  }

  // Add media list
  // User statuses operations
  let completed = '';
  let planned = '';
  let inProgress = '';
  let paused = '';
  let dropped = '';
  let repeating = '';

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
          completed += `- ${mediaList.discordName} ${score}\n`;
          break;
        }
        case MediaListStatus.CURRENT: {
          inProgress += `- ${mediaList.discordName} ${score} ${progress}\n`;
          break;
        }
        case MediaListStatus.DROPPED: {
          dropped += `- ${mediaList.discordName} ${score} ${progress}\n`;
          break;
        }
        case MediaListStatus.PAUSED: {
          paused += `- ${mediaList.discordName} ${score} ${progress}\n`;
          break;
        }
        case MediaListStatus.PLANNING: {
          planned += `- ${mediaList.discordName}\n`;
          break;
        }
        case MediaListStatus.REPEATING: {
          repeating += `- ${mediaList.discordName} ${score} ${progress}\n`;
          break;
        }
      }
    }
  }

  // User scores
  if (paused) {
    description += `\n\n-# Paused\n${paused.slice(0, -1)}`;
  }

  if (inProgress) {
    description += `\n\n-# In Progress\n${inProgress.slice(0, -1)}`;
  }

  if (repeating) {
    description += `\n\n-# Repeating\n${repeating.slice(0, -1)}`;
  }

  if (completed) {
    description += `\n\n-# Completed\n${completed.slice(0, -1)}`;
  }

  if (dropped) {
    description += `\n\n-# Dropped\n${dropped.slice(0, -1)}`;
  }

  if (planned) {
    description += `\n\n-# Planned\n${planned.slice(0, -1)}`;
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
        content: description
      }
    ],
    accessory: {
      type: ComponentType.Thumbnail,
      media: {
        url: `${media.coverImage?.extraLarge}`
      }
    }
  });

  return [
    {
      type: ComponentType.Container,
      components
    }
  ];
};
