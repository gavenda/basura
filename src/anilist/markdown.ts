/**
 * Converts AniList's markdown flavour to Discord's.
 *
 * Descriptions are requested as markdown rather than HTML: AniList's own HTML rendering mangles some
 * links (an `@name` inside a URL becomes a link to that AniList user) and marks spoilers with spans
 * that an HTML converter drops, showing them in plain sight.
 *
 * What differs from Discord:
 * - `__text__` is bold on AniList but underline on Discord.
 * - Spoilers are `~!text!~` on AniList and `||text||` on Discord.
 * - Media descriptions mix in HTML: `<br>`, `<i>` and `<b>`.
 * - AniList extras with no Discord equivalent: `~~~centered~~~`, `img(url)`, `webm(url)`, `youtube(id)`.
 */

/**
 * Discord spoilers work line by line here: a spoiler left open across a line break swallows the
 * next line's markers (`-# `, `- `). So each line is wrapped on its own, after any list marker.
 */
const spoiler = (_: string, content: string) =>
  content
    .split('\n')
    .map((line) => {
      const [, prefix = '', rest = ''] = /^(\s*(?:[-*+]|\d+\.)\s+)?(.*)$/.exec(line) ?? [];
      return rest.trim() ? `${prefix}||${rest}||` : line;
    })
    .join('\n');

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

const decodeEntities = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === '#') {
      const point = code[1]?.toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }
    return ENTITIES[code.toLowerCase()] ?? entity;
  });

/** Any HTML tag, but not a stray `<` in prose such as "a < b". */
const TAG = /<\/?[a-z][a-z0-9]*(?:\s[^<>]*)?\/?>/gi;

/** Link targets and bare URLs, kept out of the rewrites so underscores or tildes in a URL survive. */
const URL_PATTERN = /\]\((?:<[^>]*>|[^)\s]+)(?:\s+"[^"]*")?\)|https?:\/\/[^\s<>()]+/g;

export const aniListToDiscordMarkdown = (input: string): string => {
  const urls: string[] = [];
  const hold = (match: string) => `\u0000${urls.push(match) - 1}\u0000`;

  let text = input.replace(/\r\n?/g, '\n').replace(URL_PATTERN, hold);

  text = text
    // HTML from media descriptions.
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(?:i|em)>/gi, '*')
    .replace(/<\/?(?:b|strong)>/gi, '**')
    .replace(TAG, '');

  text = decodeEntities(text)
    // AniList extras with nothing to show in Discord.
    .replace(/(?:img|webm)\d*%?\(\s*[^)]*\)/gi, '')
    .replace(/youtube\(\s*([^)\s]+)\s*\)/gi, (_, id: string) =>
      // A full URL is already held aside as a placeholder; a bare id becomes a link.
      id.startsWith('\u0000') ? id : `https://youtu.be/${id}`
    )
    .replace(/~~~/g, '')
    .replace(/~!([\s\S]*?)!~/g, spoiler)
    .replace(/__(?=\S)([^\n]*?\S)__/g, '**$1**')
    // Trailing spaces, and the gaps left by removed parts.
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n');

  return text.replace(/\u0000(\d+)\u0000/g, (_, index: string) => urls[Number(index)]!).trim();
};
