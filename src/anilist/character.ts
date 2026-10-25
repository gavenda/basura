import { compact } from '../utils/array';
import { titleCase } from '../utils/strings';
import { Card } from './card';
import { aniListRequest, aniListSearchRequest, CACHE_TTL, normalizeSearch } from './client';
import { aliases, descriptionToMarkdown, fuzzyDate, mediaFormatDisplay, nameChoices } from './format';
import { findCharacterNamesQuery, findCharacterQuery } from './queries';
import { FindCharacterNamesQuery, FindCharacterQuery, MediaType } from './types';

export type Character = NonNullable<FindCharacterQuery['Character']>;

export const findCharacterNames = async (search: string, env: Env) => {
  const result = await aniListSearchRequest<FindCharacterNamesQuery>({
    query: findCharacterNamesQuery,
    variables: { search: normalizeSearch(search) },
    env
  });
  return nameChoices(result.Page?.characters);
};

export const findCharacter = async (characterId: number, env: Env): Promise<Character | null> => {
  const result = await aniListRequest<FindCharacterQuery>({
    query: findCharacterQuery,
    variables: { characterId },
    env,
    cacheTtl: CACHE_TTL.details
  });
  return result.Character;
};

export const characterToCard = (character: Character): Card => {
  const { name } = character;
  const birthday = fuzzyDate(character.dateOfBirth);
  const appearances = compact(character.media?.edges ?? []).map(({ node, characterRole }) => ({
    type: node?.type,
    line: `- [${node?.title?.english || node?.title?.romaji}](${node?.siteUrl}) (${mediaFormatDisplay(node?.format ?? null)}) - ${titleCase(characterRole)}`
  }));

  return {
    title: name?.full || name?.native || 'Unknown',
    subtitles: compact([
      name?.native && `Native: ${name.native}`,
      name?.alternative?.[0] && `Alternative: ${name.alternative[0]}`
    ]),
    url: character.siteUrl,
    tags: compact([character.gender, birthday && `🎂 ${birthday}`, `❤️ ${character.favourites ?? 0}`]),
    thumbnail: character.image?.large || character.image?.medium,
    pages: [
      {
        id: 'overview',
        label: 'Overview',
        description: descriptionToMarkdown(character.description, 'No description available.'),
        sections: [['Aliases', aliases(name?.alternative)]]
      },
      {
        id: 'anime',
        label: 'Anime',
        sections: [['Anime Appearances', appearances.filter((x) => x.type === MediaType.ANIME).map((x) => x.line)]]
      },
      {
        id: 'manga',
        label: 'Manga',
        sections: [['Manga Appearances', appearances.filter((x) => x.type !== MediaType.ANIME).map((x) => x.line)]]
      }
    ]
  };
};
