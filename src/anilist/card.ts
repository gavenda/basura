import {
  APIComponentInContainer,
  APIMessageTopLevelComponent,
  APISectionAccessoryComponent,
  APITextDisplayComponent,
  ButtonStyle,
  ComponentType
} from 'discord.js';
import { limitTextByParagraphs } from '../utils/strings';

/** Discord's limit on the text across all Text Displays in one Components V2 message. */
const TEXT_LIMIT = 4000;
/** Lines shown per section before the rest are counted in an "…and N more" line. */
const SECTION_LINE_LIMIT = 10;
/** Room kept for a page's description when its sections are long, so the description isn't squeezed out. */
const DESCRIPTION_RESERVE = 1000;

/** A detail section as [heading, lines]. Sections with no lines are skipped. */
export type CardSection = [heading: string, lines: string[]];

/** One page of a card, picked with the buttons under it. */
export interface CardPage {
  /** Stable key for the page's button. Keep it short: it goes in the button's custom_id. */
  id: string;
  label: string;
  /** Markdown shown first. Shortened to whatever room the page has left. */
  description?: string;
  sections?: CardSection[];
}

/** The parts of an AniList result (media, character or staff). Empty parts are left out. */
export interface Card {
  title: string;
  /** Small lines under the title, such as the native or alternative name. */
  subtitles?: string[];
  url: string | null;
  banner?: string | null;
  /** Facts joined into one small line under the title, such as status and episode count. */
  info?: string[];
  /** Labels shown as a row of disabled buttons. Discord allows 5 per row. */
  tags?: string[];
  thumbnail?: string | null;
  /** The first page is shown by default. Pages with no description or section lines are dropped. */
  pages: CardPage[];
}

export interface CardView {
  /** Builds a page button's custom_id from the page id. */
  pageCustomId: (pageId: string) => string;
  /** Page to show. Falls back to the first page when missing or unknown. */
  pageId?: string;
}

const text = (content: string): APITextDisplayComponent => ({ type: ComponentType.TextDisplay, content });

/** Text in a section with the accessory beside it, or plain text when there's no accessory. */
const withAccessory = (
  texts: APITextDisplayComponent[],
  accessory: APISectionAccessoryComponent | undefined
): APIComponentInContainer[] => {
  return accessory ? [{ type: ComponentType.Section, components: texts, accessory }] : texts;
};

const hasContent = (page: CardPage) =>
  Boolean(page.description) || (page.sections ?? []).some(([, lines]) => lines.length);

/**
 * Renders sections within `budget` characters. Each section shows up to SECTION_LINE_LIMIT lines, and fewer when
 * room runs out, with the rest counted in an "…and N more" line. Sections that don't fit at all are left out.
 */
const fitSections = (sections: CardSection[], budget: number): string => {
  const blocks: string[] = [];
  let used = 0;

  for (const [heading, lines] of sections) {
    if (lines.length === 0) continue;

    const shown = lines.slice(0, SECTION_LINE_LIMIT);
    const render = () => {
      const hidden = lines.length - shown.length;
      return [`-# ${heading}`, ...shown, ...(hidden > 0 ? [`-# …and ${hidden} more`] : [])].join('\n');
    };
    const gap = blocks.length > 0 ? 2 : 0;

    let block = render();
    while (shown.length > 0 && used + gap + block.length > budget) {
      shown.pop();
      block = render();
    }
    if (shown.length === 0) break;

    blocks.push(block);
    used += gap + block.length;
  }

  return blocks.join('\n\n');
};

export const cardToComponents = (card: Card, view: CardView): APIMessageTopLevelComponent[] => {
  const { title, subtitles = [], url, banner, info = [], tags = [], thumbnail } = card;
  const pages = card.pages.filter(hasContent);
  const page = pages.find((p) => p.id === view.pageId) ?? pages[0];
  const components: APIComponentInContainer[] = [];
  const texts: string[] = [];

  if (banner) {
    components.push({ type: ComponentType.MediaGallery, items: [{ media: { url: banner } }] });
  }

  const titleTexts = [text(`## ${title}`)];
  if (subtitles.length > 0) {
    titleTexts.push(text(subtitles.map((subtitle) => `-# _(${subtitle})_`).join('\n')));
  }
  texts.push(...titleTexts.map((t) => t.content));
  components.push(
    ...withAccessory(
      titleTexts,
      url ? { type: ComponentType.Button, style: ButtonStyle.Link, label: 'AniList', url } : undefined
    )
  );

  if (info.length > 0) {
    const infoText = text(`-# ${info.join(' — ')}`);
    texts.push(infoText.content);
    components.push(infoText);
  }

  if (tags.length > 0) {
    components.push({
      type: ComponentType.ActionRow,
      components: tags.slice(0, 5).map((label, index) => ({
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        custom_id: `tag:${index}`,
        label,
        disabled: true
      }))
    });
  }

  components.push({ type: ComponentType.Separator });

  if (page) {
    // Sections get the room first, minus a reserve for the description, which then takes what's left.
    const remaining = TEXT_LIMIT - texts.reduce((sum, t) => sum + t.length, 0);
    const reserve = page.description ? Math.min(page.description.length, DESCRIPTION_RESERVE) : 0;
    const sections = fitSections(page.sections ?? [], remaining - reserve);
    const description = page.description && limitTextByParagraphs(page.description, remaining - sections.length);
    const thumbnailAccessory: APISectionAccessoryComponent | undefined = thumbnail
      ? { type: ComponentType.Thumbnail, media: { url: thumbnail } }
      : undefined;

    // The first block sits beside the thumbnail; sections under a description get the full width.
    const [first, second] = [description, sections].filter(Boolean) as string[];
    if (first) components.push(...withAccessory([text(first)], thumbnailAccessory));
    if (second) components.push(text(second));
  }

  if (pages.length > 1) {
    components.push({
      type: ComponentType.ActionRow,
      components: pages.slice(0, 5).map((p) => ({
        type: ComponentType.Button,
        style: p === page ? ButtonStyle.Primary : ButtonStyle.Secondary,
        custom_id: view.pageCustomId(p.id),
        label: p.label,
        disabled: p === page
      }))
    });
  }

  return [{ type: ComponentType.Container, components }];
};
