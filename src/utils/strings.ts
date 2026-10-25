export const truncate = (str: string, n: number) => {
  return str.length > n ? str.slice(0, n - 3) + '...' : str;
};

export const isBlank = (str: string | null | undefined) => {
  return !str || /^\s*$/.test(str);
};

/** Minimum characters before autocomplete searches AniList. */
export const MIN_SEARCH_LENGTH = 3;

// Japanese/Chinese/Korean characters carry a whole word or syllable each, so short searches are still useful.
const CJK_REGEX = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

/** True when a search is too short to be worth a request: blank, or under MIN_SEARCH_LENGTH characters with no CJK. */
export const isSearchTooShort = (str: string) => {
  if (isBlank(str)) return true;
  const trimmed = str.trim();
  return !CJK_REGEX.test(trimmed) && trimmed.length < MIN_SEARCH_LENGTH;
};

/** Room left before a paragraph is worth cutting into rather than dropping. */
const MIN_PARTIAL_PARAGRAPH = 200;

/**
 * Shortens text to at most maxLength characters, cutting at a paragraph break ('\n\n').
 * The paragraph that doesn't fit is cut short instead when there's a fair amount of room left for it,
 * so a short first paragraph (like a hashtag) isn't all that's shown.
 */
export const limitTextByParagraphs = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  if (maxLength <= 3) return '';

  let limited = '';
  for (const paragraph of text.split('\n\n')) {
    const next = limited ? `${limited}\n\n${paragraph}` : paragraph;
    if (next.length > maxLength) {
      const room = maxLength - limited.length - 2;
      if (!limited) limited = truncate(paragraph, maxLength);
      else if (room >= MIN_PARTIAL_PARAGRAPH) limited = `${limited}\n\n${truncate(paragraph, room)}`;
      break;
    }
    limited = next;
  }

  return limited.trim();
};

/** Title cases an AniList enum value or phrase: `LIGHT_NOVEL` becomes `Light Novel`. */
export const titleCase = (str: string | null | undefined): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replaceAll('_', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
