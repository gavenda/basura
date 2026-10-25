import { APIApplicationCommandOptionChoice, Locale, LocalizationMap } from 'discord-api-types/v10';
import { NodeHtmlMarkdown } from 'node-html-markdown-cloudflare';
import { compact } from '../utils/array';
import { isBlank, titleCase, truncate } from '../utils/strings';
import { MediaFormat } from './types';

/** Discord's limit for an autocomplete choice name. */
const CHOICE_NAME_LIMIT = 100;
/** Locales that see a person's native name in autocomplete. */
const CJK_LOCALES = [Locale.Japanese, Locale.Korean, Locale.ChineseCN, Locale.ChineseTW];

export const localize = (name: string, locales: Locale[]): LocalizationMap => {
  return Object.fromEntries(locales.map((locale) => [locale, truncate(name, CHOICE_NAME_LIMIT)]));
};

interface Person {
  id: number;
  name: { full: string | null; native: string | null } | null;
}

/** Autocomplete choices for characters or staff, showing native names to Japanese, Korean and Chinese users. */
export const nameChoices = (people: (Person | null)[] | null | undefined): APIApplicationCommandOptionChoice[] => {
  const choices: APIApplicationCommandOptionChoice[] = [];

  for (const person of people ?? []) {
    if (!person?.name?.full) continue;

    const name = truncate(person.name.full, CHOICE_NAME_LIMIT);
    if (choices.some((choice) => choice.name === name)) continue;

    choices.push({
      name,
      name_localizations: person.name.native ? localize(person.name.native, CJK_LOCALES) : {},
      value: person.id
    });
  }

  return choices;
};

const sourceRegex = /^(\(Source: .*\))$/gm;
const headingRegex = /^\*\*(.*)\*\*/gm;

/**
 * Converts an AniList HTML description to Discord markdown, with source and heading lines made small.
 * Not shortened here: the card fits it to the room its page has left.
 */
export const descriptionToMarkdown = (html: string | null, fallback: string): string => {
  if (isBlank(html)) return fallback;

  const markdown = NodeHtmlMarkdown.translate(html!).replaceAll(sourceRegex, '-# $1').replaceAll(headingRegex, '-# $1');

  return isBlank(markdown) ? fallback : markdown.trim();
};

/** Up to 5 unique alternative names as list items, skipping the first, which is already shown under the title. */
export const aliases = (alternative: (string | null)[] | null | undefined): string[] => {
  const names = compact((alternative ?? []).slice(1).map((name) => name?.trim()));
  return [...new Set(names)].slice(0, 5).map((name) => `- ${name}`);
};

const ordinal = (n: number) => {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`;
};

const monthName = (month: number) => {
  return new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(Date.UTC(2000, month - 1, 1));
};

interface FuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

/** Formats an AniList date like "26th June 2044", leaving out unknown parts. Undefined when nothing is known. */
export const fuzzyDate = (date: FuzzyDate | null): string | undefined => {
  if (!date) return undefined;
  const parts = compact([date.day && ordinal(date.day), date.month && monthName(date.month), date.year]);
  return parts.length > 0 ? parts.join(' ') : undefined;
};

/** Star rating for a 0-100 score. */
export const toStars = (score: number): string => {
  const stars = score >= 90 ? 5 : score >= 70 ? 4 : score >= 50 ? 3 : score >= 30 ? 2 : score >= 1 ? 1 : 0;
  return '⭐'.repeat(stars);
};

const FORMAT_NAMES: Partial<Record<MediaFormat, string>> = {
  [MediaFormat.ONA]: 'ONA',
  [MediaFormat.OVA]: 'OVA',
  [MediaFormat.TV]: 'TV',
  [MediaFormat.TV_SHORT]: 'TV Short',
  [MediaFormat.ONE_SHOT]: 'Oneshot'
};

export const mediaFormatDisplay = (format: MediaFormat | null): string => {
  if (!format) return '-';
  return FORMAT_NAMES[format] ?? titleCase(format);
};
