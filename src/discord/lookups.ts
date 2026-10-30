import type { APIApplicationCommandOptionChoice, APIMessageTopLevelComponent } from 'discord.js';
import { Card, cardToComponents } from '../anilist/card';
import { characterToCard, findCharacter, findCharacterNames } from '../anilist/character';
import { findMedia, findMediaListEntries, findMediaTitles, MemberEntry, mediaToCard } from '../anilist/media';
import { findStaff, findStaffNames, staffToCard } from '../anilist/staff';
import { MediaType } from '../anilist/types';
import { db, UserRow } from '../db';
import { encodeCardPageId } from './ids';

/** Something looked up on AniList by id, autocompleted from a search, and shown as a card. */
export interface Lookup<T = unknown> {
  /** The command name, and the `kind` in the card's page button ids. */
  kind: string;
  notFound: string;
  find: (id: number) => Promise<T | null>;
  toCard: (item: T, guildId: string | null) => Card | Promise<Card>;
  search: (query: string) => Promise<APIApplicationCommandOptionChoice<number>[]>;
}

const guildMembersQuery = db.query<Pick<UserRow, 'discord_id' | 'anilist_id'>, [string]>(
  'SELECT discord_id, anilist_id FROM anilist_user WHERE discord_guild_id = ?'
);

/** List entries for the media from members of this guild who linked their AniList account. */
const findMemberEntries = async (guildId: string | null, mediaId: number): Promise<MemberEntry[]> => {
  if (!guildId) return [];

  const results = guildMembersQuery.all(guildId);
  if (results.length === 0) return [];

  const discordIds = new Map(results.map((row) => [row.anilist_id, row.discord_id]));
  const entries = await findMediaListEntries([...discordIds.keys()], mediaId);

  return entries.map((entry) => ({ ...entry, discordName: `<@${discordIds.get(entry.userId)}>` }));
};

const mediaLookup = (kind: string, mediaType: MediaType) =>
  ({
    kind,
    notFound: mediaType === MediaType.ANIME ? 'Unable to find anime.' : 'Unable to find manga.',
    find: (id) => findMedia(id, mediaType),
    toCard: async (media, guildId) => mediaToCard(media, await findMemberEntries(guildId, media.id)),
    search: (query) => findMediaTitles(query, mediaType) as Promise<APIApplicationCommandOptionChoice<number>[]>
  }) satisfies Lookup<NonNullable<Awaited<ReturnType<typeof findMedia>>>>;

export const animeLookup = mediaLookup('anime', MediaType.ANIME);
export const mangaLookup = mediaLookup('manga', MediaType.MANGA);

export const staffLookup = {
  kind: 'staff',
  notFound: 'Unable to find staff.',
  find: findStaff,
  toCard: staffToCard,
  search: findStaffNames as Lookup['search']
} satisfies Lookup<NonNullable<Awaited<ReturnType<typeof findStaff>>>>;

export const characterLookup = {
  kind: 'character',
  notFound: 'Unable to find character.',
  find: findCharacter,
  toCard: characterToCard,
  search: findCharacterNames as Lookup['search']
} satisfies Lookup<NonNullable<Awaited<ReturnType<typeof findCharacter>>>>;

export const lookups: Lookup<any>[] = [animeLookup, mangaLookup, staffLookup, characterLookup];

/** The card for an id, on the given page (the first when unset). Null when AniList doesn't know the id. */
export const renderLookup = async <T>(
  lookup: Lookup<T>,
  id: number,
  guildId: string | null,
  page?: string
): Promise<APIMessageTopLevelComponent[] | null> => {
  const item = await lookup.find(id);
  if (!item) return null;

  const card = await lookup.toCard(item, guildId);
  return cardToComponents(card, {
    pageCustomId: (pageId) => encodeCardPageId({ kind: lookup.kind, id, page: pageId }),
    pageId: page
  });
};
