import { findCharacter, findCharacterNames } from '@anilist/character.js';
import { Character, CharacterName, MediaType } from '@anilist/gql/types.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { ComponentContext } from '@app/context/component-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { Page, handlePaginatorComponents, paginator } from '@app/paginator.js';
import { APIApplicationCommandOptionChoice, APIEmbed, APIEmbedField } from 'discord-api-types/v10';
import { decode } from 'he';
import { appendIfNotMax, htmlToMarkdown, isBlank, isNotBlank, titleCase, truncate, truncateParagraph, zip } from './util.js';

export class CharacterCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    const query = context.getStringOption(`query`).value;
    const characters = await findCharacter(query);

    if (characters === undefined || characters.length === 0) {
      await context.reply({
        message: `No anime/manga character found.`,
      });
      return;
    }

    let pageNumber = 1;
    const pages: Page[] = [];

    for (const character of characters) {
      pages.push({
        embed: createCharacterEmbed(character, pageNumber, characters.length),
        link: {
          label: 'View on AniList',
          url: character.siteUrl!!,
        },
      });
      pageNumber = pageNumber + 1;
    }

    await paginator({ context, pages });
  }

  async handleAutocomplete(ctx: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const query = ctx.getStringOption(`query`).value;
    const names = await findCharacterNames(query);

    return names.map((x) => {
      return {
        name: x,
        value: x,
      };
    });
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}

const createCharacterEmbed = (character: Character, pageNumber: number, pageMax: number): APIEmbed => {
  const title = characterName(character.name);
  const fields: APIEmbedField[] = [];
  const aliases = truncateParagraph(characterAliases(character.name), 256);

  let animeAppearances = '';
  let mangaAppearances = '';
  let description = character.description ?? 'No description found.';

  // Description operations
  // Remove spoilers
  description = description.replaceAll(/\~!.*?!\~/g, '(spoiler removed)\n');
  // Convert html to markdown
  description = htmlToMarkdown(description);
  description = decode(description);
  description = truncate(description, 4096);
  description = description.trim();

  // Appearances operations
  if (character.media?.nodes && character.media?.edges) {
    const nodes = zip(character.media.nodes, character.media.edges);
    for (const pair of nodes) {
      const [media, edge] = pair;
      const mediaTitle = media.title?.english ?? media.title?.romaji;
      const role = edge.characterRole as string;
      const appearance = `- [${mediaTitle}](${media.siteUrl}) [${titleCase(role)}]\n`;

      if (media.type === MediaType.ANIME) {
        animeAppearances = appendIfNotMax(animeAppearances, appearance, 256);
      } else {
        mangaAppearances = appendIfNotMax(mangaAppearances, appearance, 256);
      }
    }

    animeAppearances = truncate(animeAppearances, 256);
    mangaAppearances = truncate(mangaAppearances, 256);
  }

  if (isNotBlank(animeAppearances)) {
    fields.push({
      name: `Anime Appearances`,
      value: animeAppearances,
    });
  }

  if (isNotBlank(mangaAppearances)) {
    fields.push({
      name: `Manga Appearances`,
      value: mangaAppearances,
    });
  }

  if (isNotBlank(aliases)) {
    fields.push({
      name: 'Aliases',
      value: aliases,
    });
  }

  return {
    title,
    description,
    thumbnail: {
      url: character.image?.large ?? character.image?.medium ?? '',
    },
    author: {
      name: `ID#${character.id}`,
    },
    color: 16711680,
    fields,
    footer: {
      text: `Page ${pageNumber} / ${pageMax}`,
    },
  };
};

const characterName = (name: CharacterName | undefined) => {
  if (name?.native) {
    return `${name.full} (${name.native})`;
  } else {
    return name?.full;
  }
};

const characterAliases = (name: CharacterName | undefined): string => {
  let aliases = '';
  const names = name as Required<CharacterName>;
  const uniqueNames = [...new Set(names.alternative)];

  for (const alternateName of uniqueNames) {
    if (isBlank(alternateName)) {
      continue;
    }
    const aliasEntry = `- ${alternateName.trim()}\n`;
    aliases = appendIfNotMax(aliases, aliasEntry, 256);
  }
  return aliases;
};
