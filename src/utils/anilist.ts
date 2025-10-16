import {
  APIComponentInContainer,
  APIComponentInMessageActionRow,
  APIMessageTopLevelComponent,
  APITextDisplayComponent,
  ButtonStyle,
  ComponentType
} from 'discord-api-types/payloads/v10';
import { NodeHtmlMarkdown } from 'node-html-markdown-cloudflare';
import { Media, MediaFormat, MediaRankType } from '../anilist/gql';
import { titleCase } from './strings';

export const toIntColor = (color: string): number => {
  switch (color) {
    case 'blue':
      return 4044018;
    case 'purple':
      return 12608511;
    case 'green':
      return 5032529;
    case 'orange':
      return 15697946;
    case 'red':
      return 14758707;
    case 'pink':
      return 12608511;
    case 'gray':
      return 16555478;
    default:
      return 0;
  }
};

export const toStars = (score: number = 0): string => {
  if (score >= 90) {
    // 5 star
    return '⭐'.repeat(5);
  } else if (score >= 70 && score <= 89) {
    // 4 star
    return '⭐'.repeat(4);
  } else if (score >= 50 && score <= 69) {
    // 3 star
    return '⭐'.repeat(3);
  } else if (score >= 30 && score <= 49) {
    // 2 star
    return '⭐'.repeat(2);
  } else if (score >= 1 && score <= 29) {
    // 1 star
    return '⭐'.repeat(1);
  }
  return '';
};

export const mediaFormatDisplay = (format: MediaFormat) => {
  switch (format) {
    case MediaFormat.MANGA:
      return 'Manga';
    case MediaFormat.MOVIE:
      return 'Movie';
    case MediaFormat.MUSIC:
      return 'Music';
    case MediaFormat.NOVEL:
      return 'Novel';
    case MediaFormat.ONA:
      return 'ONA';
    case MediaFormat.ONE_SHOT:
      return 'Oneshot';
    case MediaFormat.OVA:
      return 'OVA';
    case MediaFormat.SPECIAL:
      return 'Special';
    case MediaFormat.TV:
      return 'TV';
    case MediaFormat.TV_SHORT:
      return 'TV Short';
    default:
      return '-';
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
