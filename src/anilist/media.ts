import { APIApplicationCommandOptionChoice, Locale, LocalizationMap } from 'discord-api-types/v10';
import { compact } from '../utils/array';
import { titleCase, truncate } from '../utils/strings';
import { cardToComponents } from './card';
import { aniListRequest, aniListSearchRequest, CACHE_TTL, normalizeSearch } from './client';
import { descriptionToMarkdown, localize, mediaFormatDisplay, toStars } from './format';
import { findMediaListEntriesQuery, findMediaQuery, findMediaTitlesQuery } from './queries';
import {
  FindMediaListEntriesQuery,
  FindMediaQuery,
  FindMediaTitlesQuery,
  MediaListStatus,
  MediaRankType,
  MediaType
} from './types';

export type Media = NonNullable<FindMediaQuery['Media']>;
export type MediaListEntry = NonNullable<
  NonNullable<NonNullable<FindMediaListEntriesQuery['Page']>['mediaList']>[number]
>;

/** A guild member's list entry for the media, with how to mention them. */
export interface MemberEntry extends MediaListEntry {
  discordName: string;
}

/** Locales that see the native title, by the media's country of origin. */
const NATIVE_TITLE_LOCALES: Record<string, Locale[]> = {
  JP: [Locale.Japanese],
  KR: [Locale.Korean],
  CN: [Locale.ChineseCN, Locale.ChineseTW]
};

export const findMediaTitles = async (
  search: string,
  mediaType: MediaType,
  env: Env
): Promise<APIApplicationCommandOptionChoice[]> => {
  const result = await aniListSearchRequest<FindMediaTitlesQuery>({
    query: findMediaTitlesQuery,
    variables: { search: normalizeSearch(search), mediaType },
    env
  });
  const choices: APIApplicationCommandOptionChoice[] = [];

  for (const media of result.Page?.media ?? []) {
    const { romaji, english, native } = media?.title ?? {};
    if (!media || !romaji) continue;

    const name = truncate(english ? `${romaji} (${english})` : romaji, 100);
    if (choices.some((choice) => choice.name === name)) continue;

    const name_localizations: LocalizationMap = {
      ...(native && localize(native, NATIVE_TITLE_LOCALES[String(media.countryOfOrigin)] ?? [])),
      ...(english && localize(english, [Locale.EnglishGB, Locale.EnglishUS]))
    };

    choices.push({ name, name_localizations, value: media.id });
  }

  return choices;
};

export const findMedia = async (mediaId: number, mediaType: MediaType, env: Env): Promise<Media | null> => {
  const result = await aniListRequest<FindMediaQuery>({
    query: findMediaQuery,
    variables: { mediaId, mediaType },
    env,
    cacheTtl: CACHE_TTL.details
  });
  return result.Media;
};

export const findMediaListEntries = async (userIds: number[], mediaId: number, env: Env) => {
  const result = await aniListRequest<FindMediaListEntriesQuery>({
    query: findMediaListEntriesQuery,
    variables: { userIds, mediaId },
    env
  });
  return compact(result.Page?.mediaList ?? []);
};

/** Guild member list sections, in display order. */
const STATUS_SECTIONS: [MediaListStatus, string][] = [
  [MediaListStatus.PAUSED, 'Paused'],
  [MediaListStatus.CURRENT, 'In Progress'],
  [MediaListStatus.REPEATING, 'Repeating'],
  [MediaListStatus.COMPLETED, 'Completed'],
  [MediaListStatus.DROPPED, 'Dropped'],
  [MediaListStatus.PLANNING, 'Planned']
];

const memberLine = (entry: MemberEntry): string => {
  const score = entry.score ? `(Score: ${entry.score})` : '';
  const progress = `[Progress: ${entry.progress ?? 0}]`;

  switch (entry.status) {
    case MediaListStatus.PLANNING:
      return `- ${entry.discordName}`;
    case MediaListStatus.COMPLETED:
      return compact([`- ${entry.discordName}`, score]).join(' ');
    default:
      return compact([`- ${entry.discordName}`, score, progress]).join(' ');
  }
};

export const mediaToComponents = (media: Media, members: MemberEntry[]) => {
  const { title } = media;
  const info = compact([
    media.status && titleCase(media.status),
    media.episodes && `${media.episodes} Episodes`,
    media.chapters && `${media.chapters} Chapters`
  ]);
  const tags = compact([
    media.format && mediaFormatDisplay(media.format),
    media.season && media.seasonYear && `${titleCase(media.season)} ${media.seasonYear}`
  ]);

  // Prefer the all-time rank as a tag. A seasonal rank becomes the tag when there's no all-time rank.
  const rankings = compact(media.rankings ?? [])
    .filter((ranking) => ranking.type === MediaRankType.RATED)
    .sort((a, b) => a.rank - b.rank);
  const allTimeRank = rankings.find((ranking) => ranking.allTime);
  const seasonRank = rankings.find((ranking) => !ranking.allTime && ranking.season);
  const seasonRankLabel =
    seasonRank && `Rank #${seasonRank.rank} of ${titleCase(seasonRank.season)} ${seasonRank.year}`;

  if (allTimeRank) {
    tags.push(`Rank #${allTimeRank.rank}`);
    if (seasonRankLabel) info.push(seasonRankLabel);
  } else if (seasonRankLabel) {
    tags.push(seasonRankLabel);
  }

  if (media.favourites) tags.push(`❤️ ${media.favourites}`);
  if (media.meanScore) tags.push(toStars(media.meanScore));

  const characters = compact(media.characters?.edges ?? []).map(({ node, role }) => {
    const native = node?.name?.native ? ` (${node.name.native})` : '';
    return `- [${node?.name?.full}](${node?.siteUrl})${native} - ${titleCase(role)}`;
  });

  const sortedMembers = [...members].sort(
    (a, b) => (a.progress ?? 0) - (b.progress ?? 0) || a.discordName.localeCompare(b.discordName)
  );
  const memberSections = STATUS_SECTIONS.map(([status, heading]): [string, string[]] => [
    heading,
    sortedMembers.filter((entry) => entry.status === status).map(memberLine)
  ]);

  return cardToComponents({
    title: title?.english || title?.romaji || title?.native || 'Untitled',
    subtitles: compact([
      title?.english && title.romaji && `Romaji: ${title.romaji}`,
      title?.native && `Native: ${title.native}`,
      media.synonyms?.[0] && `Synonym: ${media.synonyms[0]}`
    ]),
    url: media.siteUrl,
    banner: media.bannerImage,
    info,
    tags,
    description: compact([
      media.hashtag && `-# ${media.hashtag}`,
      descriptionToMarkdown(media.description, 'No synopsis available.')
    ]).join('\n\n'),
    thumbnail: media.coverImage?.extraLarge,
    sections: [
      ['Original Source', compact([media.source && titleCase(media.source)])],
      ['Genres', media.genres?.length ? [compact(media.genres).join(' - ')] : []],
      ['Characters', characters],
      ...memberSections
    ]
  });
};
