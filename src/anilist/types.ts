/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** The role the character plays in the media */
export enum CharacterRole {
  /** A background character in the media */
  BACKGROUND = 'BACKGROUND',
  /** A primary character role in the media */
  MAIN = 'MAIN',
  /** A supporting character role in the media */
  SUPPORTING = 'SUPPORTING'
}

/** The format the media was released in */
export enum MediaFormat {
  /** Professionally published manga with more than one chapter */
  MANGA = 'MANGA',
  /** Anime movies with a theatrical release */
  MOVIE = 'MOVIE',
  /** Short anime released as a music video */
  MUSIC = 'MUSIC',
  /** Written books released as a series of light novels */
  NOVEL = 'NOVEL',
  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  ONA = 'ONA',
  /** Manga with just one chapter */
  ONE_SHOT = 'ONE_SHOT',
  /** (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast */
  OVA = 'OVA',
  /** Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc */
  SPECIAL = 'SPECIAL',
  /** Anime broadcast on television */
  TV = 'TV',
  /** Anime which are under 15 minutes in length and broadcast on television */
  TV_SHORT = 'TV_SHORT'
}

/** Media list watching/reading status enum. */
export enum MediaListStatus {
  /** Finished watching/reading */
  COMPLETED = 'COMPLETED',
  /** Currently watching/reading */
  CURRENT = 'CURRENT',
  /** Stopped watching/reading before completing */
  DROPPED = 'DROPPED',
  /** Paused watching/reading */
  PAUSED = 'PAUSED',
  /** Planning to watch/read */
  PLANNING = 'PLANNING',
  /** Re-watching/reading */
  REPEATING = 'REPEATING'
}

/** The type of ranking */
export enum MediaRankType {
  /** Ranking is based on the media's popularity */
  POPULAR = 'POPULAR',
  /** Ranking is based on the media's ratings/score */
  RATED = 'RATED'
}

export enum MediaSeason {
  /** Predominantly started airing between October and November */
  FALL = 'FALL',
  /** Predominantly started airing between April and June */
  SPRING = 'SPRING',
  /** Predominantly started airing between July and September */
  SUMMER = 'SUMMER',
  /** Predominantly started airing between January and March */
  WINTER = 'WINTER'
}

/** Source type the media was adapted from */
export enum MediaSource {
  /** Version 2+ only. Japanese Anime */
  ANIME = 'ANIME',
  /** Version 3 only. Comics excluding manga */
  COMIC = 'COMIC',
  /** Version 2+ only. Self-published works */
  DOUJINSHI = 'DOUJINSHI',
  /** Version 3 only. Games excluding video games */
  GAME = 'GAME',
  /** Written work published in volumes */
  LIGHT_NOVEL = 'LIGHT_NOVEL',
  /** Version 3 only. Live action media such as movies or TV show */
  LIVE_ACTION = 'LIVE_ACTION',
  /** Asian comic book */
  MANGA = 'MANGA',
  /** Version 3 only. Multimedia project */
  MULTIMEDIA_PROJECT = 'MULTIMEDIA_PROJECT',
  /** Version 2+ only. Written works not published in volumes */
  NOVEL = 'NOVEL',
  /** An original production not based of another work */
  ORIGINAL = 'ORIGINAL',
  /** Other */
  OTHER = 'OTHER',
  /** Version 3 only. Picture book */
  PICTURE_BOOK = 'PICTURE_BOOK',
  /** Video game */
  VIDEO_GAME = 'VIDEO_GAME',
  /** Video game driven primary by text and narrative */
  VISUAL_NOVEL = 'VISUAL_NOVEL',
  /** Version 3 only. Written works published online */
  WEB_NOVEL = 'WEB_NOVEL'
}

/** The current releasing status of the media */
export enum MediaStatus {
  /** Ended before the work could be finished */
  CANCELLED = 'CANCELLED',
  /** Has completed and is no longer being released */
  FINISHED = 'FINISHED',
  /** Version 2 only. Is currently paused from releasing and will resume at a later date */
  HIATUS = 'HIATUS',
  /** To be released at a later date */
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  /** Currently releasing */
  RELEASING = 'RELEASING'
}

/** Media type enum, anime or manga. */
export enum MediaType {
  /** Japanese Anime */
  ANIME = 'ANIME',
  /** Asian comic */
  MANGA = 'MANGA'
}

export type FindMediaTitlesQueryVariables = Exact<{
  search?: string | null | undefined;
  mediaType?: MediaType | null | undefined;
}>;

export type FindMediaTitlesQuery = {
  Page: {
    media: Array<{
      id: number;
      countryOfOrigin: unknown;
      title: { native: string | null; romaji: string | null; english: string | null } | null;
    } | null> | null;
  } | null;
};

export type FindMediaQueryVariables = Exact<{
  mediaId?: number | null | undefined;
  mediaType?: MediaType | null | undefined;
}>;

export type FindMediaQuery = {
  Media: {
    id: number;
    format: MediaFormat | null;
    status: MediaStatus | null;
    source: MediaSource | null;
    description: string | null;
    hashtag: string | null;
    season: MediaSeason | null;
    seasonYear: number | null;
    episodes: number | null;
    chapters: number | null;
    synonyms: Array<string | null> | null;
    bannerImage: string | null;
    genres: Array<string | null> | null;
    meanScore: number | null;
    favourites: number | null;
    siteUrl: string | null;
    title: { english: string | null; romaji: string | null; native: string | null } | null;
    rankings: Array<{
      type: MediaRankType;
      rank: number;
      year: number | null;
      allTime: boolean | null;
      season: MediaSeason | null;
    } | null> | null;
    characters: {
      edges: Array<{
        role: CharacterRole | null;
        node: { siteUrl: string | null; name: { full: string | null; native: string | null } | null } | null;
      } | null> | null;
    } | null;
    coverImage: { extraLarge: string | null } | null;
  } | null;
};

export type FindMediaListEntriesQueryVariables = Exact<{
  userIds?: Array<number | null | undefined> | number | null | undefined;
  mediaId?: number | null | undefined;
}>;

export type FindMediaListEntriesQuery = {
  Page: {
    mediaList: Array<{
      userId: number;
      status: MediaListStatus | null;
      score: number | null;
      progress: number | null;
    } | null> | null;
  } | null;
};

export type FindCharacterNamesQueryVariables = Exact<{
  search?: string | null | undefined;
}>;

export type FindCharacterNamesQuery = {
  Page: {
    characters: Array<{ id: number; name: { full: string | null; native: string | null } | null } | null> | null;
  } | null;
};

export type FindCharacterQueryVariables = Exact<{
  characterId?: number | null | undefined;
}>;

export type FindCharacterQuery = {
  Character: {
    gender: string | null;
    description: string | null;
    siteUrl: string | null;
    favourites: number | null;
    name: { full: string | null; native: string | null; alternative: Array<string | null> | null } | null;
    image: { large: string | null; medium: string | null } | null;
    dateOfBirth: { year: number | null; month: number | null; day: number | null } | null;
    media: {
      edges: Array<{
        characterRole: CharacterRole | null;
        node: {
          format: MediaFormat | null;
          type: MediaType | null;
          siteUrl: string | null;
          title: { english: string | null; romaji: string | null } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export type FindStaffNamesQueryVariables = Exact<{
  search?: string | null | undefined;
}>;

export type FindStaffNamesQuery = {
  Page: {
    staff: Array<{ id: number; name: { full: string | null; native: string | null } | null } | null> | null;
  } | null;
};

export type FindStaffQueryVariables = Exact<{
  staffId?: number | null | undefined;
}>;

export type FindStaffQuery = {
  Staff: {
    gender: string | null;
    description: string | null;
    siteUrl: string | null;
    favourites: number | null;
    name: { full: string | null; native: string | null; alternative: Array<string | null> | null } | null;
    dateOfBirth: { year: number | null; month: number | null; day: number | null } | null;
    image: { large: string | null; medium: string | null } | null;
    characters: {
      edges: Array<{
        role: CharacterRole | null;
        node: { siteUrl: string | null; name: { full: string | null; native: string | null } | null } | null;
      } | null> | null;
    } | null;
    staffMedia: {
      edges: Array<{
        staffRole: string | null;
        node: {
          siteUrl: string | null;
          title: { english: string | null; romaji: string | null; native: string | null } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};
