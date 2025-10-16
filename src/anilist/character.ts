import {
  APIApplicationCommandOptionChoice,
  APIComponentInContainer,
  APIComponentInMessageActionRow,
  APIMessageTopLevelComponent,
  APITextDisplayComponent,
  ButtonStyle,
  ComponentType,
  Locale,
  LocalizationMap
} from 'discord-api-types/v10';
import { NodeHtmlMarkdown } from 'node-html-markdown-cloudflare';
import { mediaFormatDisplay } from '../utils/anilist';
import { zip } from '../utils/array';
import { isBlank, limitTextByParagraphs, titleCase, truncate } from '../utils/strings';
import { aniListRequest } from './anilist';
import { findCharacterQuery } from './gql/find-character';
import { findCharacterNameQuery } from './gql/find-character-name';
import { Character, CharacterName, MediaType, Query } from './gql/types';

export const findCharacterNames = async (options: {
  search: string;
  env: Env;
}): Promise<APIApplicationCommandOptionChoice[]> => {
  const { search, env } = options;
  const variables = {
    search
  };

  try {
    const result = await aniListRequest<Query>({
      query: findCharacterNameQuery,
      env,
      variables
    });
    const names: APIApplicationCommandOptionChoice[] = [];
    const characters = result?.Page?.characters ?? [];

    for (const character of characters) {
      if (character?.name?.full) {
        const name = truncate(character.name.full, 100);
        const exists = names.find((x) => x.name === name);

        if (exists) continue;

        const name_localizations: LocalizationMap = {};

        if (character.name.native) {
          const nativeName = truncate(character.name.native, 100);

          name_localizations[Locale.Japanese] = nativeName;
          name_localizations[Locale.Korean] = nativeName;
          name_localizations[Locale.ChineseCN] = nativeName;
          name_localizations[Locale.ChineseTW] = nativeName;
        }

        names.push({
          name,
          name_localizations,
          value: character.id
        });
      }
    }

    return names;
  } catch (error) {
    console.error({ message: `Error when finding character names`, error });
    return [];
  }
};

export const findCharacterById = async (options: { characterId: number; env: Env }): Promise<Character | undefined> => {
  const { characterId, env } = options;
  const variables = {
    characterId
  };

  try {
    const result = await aniListRequest<Query>({
      query: findCharacterQuery,
      env,
      variables
    });
    return result?.Character;
  } catch (error) {
    console.error({ message: `Error when finding character`, error });
  }
};

export const characterToComponents = (character: Character): APIMessageTopLevelComponent[] => {
  // TITLE START

  const titleComponents: APITextDisplayComponent[] = [];

  titleComponents.push({
    type: ComponentType.TextDisplay,
    content: `## ${character.name?.full || character.name?.native}`
  });

  let altNames = '';

  if (character.name?.native) {
    altNames = altNames + `-# _(Native: ${character.name.native})_\n`;
  }

  if (character.name?.alternative && character.name.alternative.length > 0) {
    altNames = altNames + `-# _(Alternative: ${character.name?.alternative[0]})_\n`;
  }

  if (altNames.length > 0) {
    titleComponents.push({
      type: ComponentType.TextDisplay,
      content: altNames
    });
  }

  // TITLE END

  // TAGS START

  const actionRowComponents: APIComponentInMessageActionRow[] = [];

  if (character.gender) {
    actionRowComponents.push({
      custom_id: 'character:gender',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: character.gender,
      disabled: true
    });
  }

  if (character.dateOfBirth) {
    const yearNum = character.dateOfBirth.year || 0;
    const dayNum = character.dateOfBirth.day;
    const date = new Date(yearNum, character.dateOfBirth.month! - 1, character.dateOfBirth.day);

    const month = date.toLocaleString('default', { month: 'long' });
    let day: string = '';

    if (dayNum) {
      if (dayNum > 3 && dayNum < 21) {
        day = dayNum + 'th';
      } else {
        switch (dayNum % 10) {
          case 1:
            day = dayNum + 'st';
            break;
          case 2:
            day = dayNum + 'nd';
            break;
          case 3:
            day = dayNum + 'rd';
            break;
          default:
            day = dayNum + 'th';
        }
      }
    }

    const temp = [];

    if (day) {
      temp.push(day);
    }
    if (month) {
      temp.push(month);
    }
    if (yearNum) {
      temp.push(yearNum);
    }

    actionRowComponents.push({
      custom_id: 'character:birthday',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: `🎂 ${temp.join(' ')}`,
      disabled: true
    });
  }

  actionRowComponents.push({
    custom_id: 'character:favorite',
    type: ComponentType.Button,
    style: ButtonStyle.Secondary,
    label: `❤️ ${character.favourites}`,
    disabled: true
  });

  // TAGS END

  // DESCRIPTION START

  const descriptions: string[] = [];

  const sourceRegex = /^(\(Source: .*\))$/gm;
  const headingRegex = /^(?:\*\*)(.*)(?:\*\*)/gm;

  if (character.description) {
    descriptions.push(
      NodeHtmlMarkdown.translate(character.description)
        .replaceAll(sourceRegex, (replace) => `-# ${replace}`)
        .replaceAll(headingRegex, (_, replace) => `-# ${replace}`)
    );
  } else {
    descriptions.push('No description available.');
  }

  // DESCRIPTION END

  // DETAILS START

  const animeAppearances: string[] = [];
  const mangaAppearances: string[] = [];
  const details: string[] = [];

  // Appearances operations
  if (character.media?.nodes && character.media?.edges) {
    const nodes = zip(character.media.nodes, character.media.edges);
    for (const pair of nodes.slice(0, 5)) {
      const [media, edge] = pair;

      // Ensure not null
      if (media && edge) {
        const mediaTitle = media.title?.english ?? media.title?.romaji;
        const format = mediaFormatDisplay(media.format);
        const appearance = `- [${mediaTitle}](${media.siteUrl}) (${format}) - ${titleCase(edge.characterRole)}`;

        if (media.type === MediaType.ANIME) {
          animeAppearances.push(appearance);
        } else {
          mangaAppearances.push(appearance);
        }
      }
    }
  }

  const aliases = characterAliases(character.name);

  if (aliases.length > 0) {
    details.push(`-# Aliases\n${aliases.join('\n')}`);
  }

  if (animeAppearances.length > 0) {
    details.push(`-# Anime Appearances\n${animeAppearances.join('\n')}`);
  }

  if (mangaAppearances.length > 0) {
    details.push(`-# Manga Appearances\n${mangaAppearances.join('\n')}`);
  }

  // DETAILS END

  // CONTAINER BUILD START

  const components: APIComponentInContainer[] = [];

  // Title
  components.push({
    type: ComponentType.Section,
    components: titleComponents,
    accessory: {
      type: ComponentType.Button,
      style: ButtonStyle.Link,
      label: 'AniList',
      url: `${character.siteUrl}`
    }
  });

  // Tags
  if (actionRowComponents.length > 0) {
    components.push({
      type: ComponentType.ActionRow,
      components: actionRowComponents
    });
  }

  // Seperator
  components.push({
    type: ComponentType.Separator
  });

  // Description
  components.push({
    type: ComponentType.Section,
    components: [
      {
        type: ComponentType.TextDisplay,
        content: limitTextByParagraphs(descriptions.join('\n\n'), 2000)
      }
    ],
    accessory: {
      type: ComponentType.Thumbnail,
      media: {
        url: `${character.image?.large || character.image?.medium}`
      }
    }
  });

  // Details
  components.push({
    type: ComponentType.TextDisplay,
    content: details.join('\n\n')
  });

  // CONTAINER BUILD END

  return [
    {
      type: ComponentType.Container,
      components
    }
  ];
};

const characterAliases = (name: CharacterName | undefined): string[] => {
  const aliases: string[] = [];
  const names = name as Required<CharacterName>;
  const uniqueNames = [...new Set(names.alternative.slice(1))];

  for (const alternateName of uniqueNames.slice(0, 5)) {
    if (isBlank(alternateName)) {
      continue;
    }

    aliases.push(`- ${alternateName.trim()}`);
  }

  return aliases;
};
