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

/**
 * Shortens text to at most maxLength characters, cutting at a paragraph break ('\n\n').
 * Falls back to a plain cut when even the first paragraph is too long.
 */
export const limitTextByParagraphs = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  let limited = '';
  for (const paragraph of text.split('\n\n')) {
    const next = limited ? `${limited}\n\n${paragraph}` : paragraph;
    if (next.length > maxLength) break;
    limited = next;
  }

  return limited.trim() || truncate(text, maxLength);
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
