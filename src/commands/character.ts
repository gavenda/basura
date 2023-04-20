import { findCharacter, findCharacterNames } from '@anilist/character.js';
import { Character, CharacterName, MediaType } from '@anilist/gql/types.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { APIApplicationCommandOptionChoice, APIEmbed, APIEmbedField } from 'discord-api-types/v10';
import {
	appendIfNotMax,
	isBlank,
	isNotBlank,
	titleCase,
	truncate,
	truncateParagraph,
	zip
} from './util.js';

export class CharacterCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;
  async handle(ctx: SlashCommandContext): Promise<void> {
    const query = ctx.getStringOption(`query`).value;
    const character = await findCharacter(query);

    if (character && character.length > 0) {
      await ctx.reply([createEmbed(character[0])]);
    } else {
      await ctx.reply(`No anime/manga character found.`);
    }
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
}

const createEmbed = (partial: Character): APIEmbed => {
  const character = partial as Required<Character>;
  const title = characterName(character.name);
  const fields: APIEmbedField[] = [];
  const aliases = truncateParagraph(characterAliases(character.name), 256);

  let animeAppearances = '';
  let mangaAppearances = '';
  let description = character.description;

  // Description operations
  description = description.replace(new RegExp(/~!.*?!~/), '');
  description = truncate(description, 4096);

  // Appearances operations
  if (character.media.nodes && character.media.edges) {
    const nodes = zip(character.media.nodes, character.media.edges);
    for (const pair of nodes) {
      const [media, edge] = pair;
      const mediaTitle = media.title?.english ?? media.title?.romaji;
      const role = edge.characterRole as string;
      const appearance = `- [${mediaTitle}](${media.siteUrl}) [${titleCase(role)}]\n`;

      if (media.type === MediaType.Anime) {
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
      url: character?.image?.large ?? character?.image?.medium ?? '',
    },
    author: {
      name: `ID#${character.id}`,
    },
    url: character.siteUrl,
    color: 16711680,
    fields,
  };
};

const characterName = (name: CharacterName) => {
  if (name.native) {
    return `${name.full} (${name.native})`;
  } else {
    return name.full;
  }
};

const characterAliases = (name: CharacterName): string => {
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
