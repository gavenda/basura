import {
  APIApplicationCommandOptionChoice,
  APIComponentInContainer,
  APIComponentInMessageActionRow,
  APIMessageTopLevelComponent,
  APITextDisplayComponent,
  ButtonStyle,
  ComponentType,
  LocalizationMap
} from 'discord-api-types/v10';
import { NodeHtmlMarkdown } from 'node-html-markdown-cloudflare';
import { toStars } from '../utils/anilist';
import { titleCase, truncate } from '../utils/strings';
import { aniListRequest } from './anilist';
import { findMediaByIdQuery } from './gql/find-media-by-id';
import { findMediaTitleQuery } from './gql/find-media-title';
import { Media, MediaRankType, MediaType, Query } from './gql/types';

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

export const mediaToComponents = (media: Media): APIMessageTopLevelComponent[] => {
  const detailedInfo: string[] = [];
  const actionRowComponents: APIComponentInMessageActionRow[] = [];

  if (media.format) {
    actionRowComponents.push({
      custom_id: 'media:format',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: media.format,
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

  if (media.genres) {
    detailedInfo.push(`${media.genres.map((x) => `${x}`).join(` - `)}`);
  }

  if (media.episodes) {
    detailedInfo.push(`${media.episodes} Episodes`);
    actionRowComponents.push({
      custom_id: 'media:parts',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: `${media.episodes} Episodes`,
      disabled: true
    });
  }

  if (media.chapters) {
    detailedInfo.push(`${media.chapters} Chapters`);
    actionRowComponents.push({
      custom_id: 'media:parts',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: `${media.chapters} Chapters`,
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
    } else if (seasonRank && seasonRank.season) {
      actionRowComponents.push({
        custom_id: 'media:rank',
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: `Rank #${seasonRank.rank} of ${titleCase(seasonRank.season)} ${seasonRank.year}`,
        disabled: true
      });
    }
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

  const sourceRegex = /^(\(Source: .*\))$/gm;

  let description = '-# No synopsis available.';

  if (media.description) {
    description = NodeHtmlMarkdown.translate(media.description);
  }

  // Apply source regex
  description = description.replaceAll(sourceRegex, (replace) => `-# ${replace}`);

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

  if (media.synonyms) {
    altTitles = altTitles + `-# _(Synonym: ${media.synonyms[0]})_\n`;
  }

  if (altTitles.length > 0) {
    titleComponents.push({
      type: ComponentType.TextDisplay,
      content: altTitles
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

  components.push({
    type: ComponentType.TextDisplay,
    content: `-# ${detailedInfo.join(` — `)}`
  });

  // Seperator
  components.push({
    type: ComponentType.Separator
  });

  if (actionRowComponents.length > 0) {
    components.push({
      type: ComponentType.ActionRow,
      components: actionRowComponents
    });
  }

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
