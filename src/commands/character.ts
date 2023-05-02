import { findCharacter, findCharacterNames } from '@anilist/character.js';
import { Character, CharacterName, MediaType } from '@anilist/gql/types.js';
import { CommandHandler, Page, handlePaginatorComponents, paginator } from '@studio-bogus/discord-interaction-app';
import { ApplicationCommandContext, AutocompleteContext, ComponentContext, SlashCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { zip } from '@util/array.js';
import { EMBED_DESCRIPTION_LIMIT } from '@util/discord.js';
import { appendIfNotMax, htmlToMarkdown, isBlank, isNotBlank, titleCase, truncate } from '@util/strings.js';
import { APIApplicationCommandOptionChoice, APIEmbed, APIEmbedField } from 'discord-api-types/v10';
import { decode } from 'he';

export class CharacterCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    const query = context.getRequiredString(`query`);
    await handleFindCharacter(query, context);
  }

  async handleAutocomplete(ctx: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const query = ctx.getRequiredString(`query`);
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

export const handleFindCharacter = async (query: string, context: ApplicationCommandContext): Promise<void> => {
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
};

const createCharacterEmbed = (character: Character, pageNumber: number, pageMax: number): APIEmbed => {
  const title = characterName(character.name);
  const fields: APIEmbedField[] = [];
  const aliases = truncate(characterAliases(character.name), 256);

  let animeAppearances = '';
  let mangaAppearances = '';
  let description = character.description ?? 'No description found.';

  // Description operations
  // Remove spoilers
  description = description.replaceAll(/\~!.*?!\~/gs, '(spoiler removed)\n');
  // Convert html to markdown
  description = htmlToMarkdown(description);
  description = decode(description);
  description = truncate(description, EMBED_DESCRIPTION_LIMIT);
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

  fields.push({
    name: `Favorites`,
    value: `${character.favourites}`,
    inline: true,
  });

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
