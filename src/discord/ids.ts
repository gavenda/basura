/**
 * Button `custom_id`s carry the state the handler needs, because Discord gives an
 * interaction nothing but this string. Kept well under the 100 character limit.
 */
export const CARD_PAGE_PREFIX = 'card';

/** Which lookup (`anime`, `staff`, …), the AniList id, and the page of the card to show. */
export type CardPageCustomId = { kind: string; id: number; page: string };

export const encodeCardPageId = ({ kind, id, page }: CardPageCustomId): string =>
  `${CARD_PAGE_PREFIX}:${kind}:${id}:${page}`;

export const decodeCardPageId = (customId: string): CardPageCustomId | null => {
  const [prefix, kind, id, page] = customId.split(':');
  if (prefix !== CARD_PAGE_PREFIX || !kind || !id || !/^\d+$/.test(id) || !page) return null;
  return { kind, id: Number(id), page };
};

/** The dispatcher matches handlers on this, so ids must keep the prefix first. */
export const customIdPrefix = (customId: string): string => customId.split(':')[0] ?? '';
