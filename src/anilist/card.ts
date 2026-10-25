import {
  APIComponentInContainer,
  APIMessageTopLevelComponent,
  APISectionAccessoryComponent,
  APITextDisplayComponent,
  ButtonStyle,
  ComponentType
} from 'discord-api-types/v10';

/** The parts of an AniList result page (media, character or staff). Empty parts are left out. */
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
  /** Markdown shown beside the thumbnail. */
  description: string;
  thumbnail?: string | null;
  /** Detail sections as [heading, lines]. Sections with no lines are skipped. */
  sections?: [heading: string, lines: string[]][];
}

const text = (content: string): APITextDisplayComponent => ({ type: ComponentType.TextDisplay, content });

/** Text in a section with the accessory beside it, or plain text when there's no accessory. */
const withAccessory = (
  texts: APITextDisplayComponent[],
  accessory: APISectionAccessoryComponent | undefined
): APIComponentInContainer[] => {
  return accessory ? [{ type: ComponentType.Section, components: texts, accessory }] : texts;
};

export const cardToComponents = (card: Card): APIMessageTopLevelComponent[] => {
  const { title, subtitles = [], url, banner, info = [], tags = [], description, thumbnail, sections = [] } = card;
  const components: APIComponentInContainer[] = [];

  if (banner) {
    components.push({ type: ComponentType.MediaGallery, items: [{ media: { url: banner } }] });
  }

  const titleTexts = [text(`## ${title}`)];
  if (subtitles.length > 0) {
    titleTexts.push(text(subtitles.map((subtitle) => `-# _(${subtitle})_`).join('\n')));
  }
  components.push(
    ...withAccessory(
      titleTexts,
      url ? { type: ComponentType.Button, style: ButtonStyle.Link, label: 'AniList', url } : undefined
    )
  );

  if (info.length > 0) {
    components.push(text(`-# ${info.join(' — ')}`));
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

  components.push(
    ...withAccessory(
      [text(description)],
      thumbnail ? { type: ComponentType.Thumbnail, media: { url: thumbnail } } : undefined
    )
  );

  const details = sections
    .filter(([, lines]) => lines.length > 0)
    .map(([heading, lines]) => `-# ${heading}\n${lines.join('\n')}`);

  if (details.length > 0) {
    components.push(text(details.join('\n\n')));
  }

  return [{ type: ComponentType.Container, components }];
};
