import { logger } from '@logger/logger';
import { aniListRequest } from './anilist.js';
import { FIND_CHARACTER_NAME } from './gql/find-character-name.js';
import { FIND_CHARACTER } from './gql/find-character.js';
import { Character, Query } from './gql/types.js';

export const findCharacterNames = async (query: string): Promise<string[]> => {
  const variables = {
    query,
    page: 1,
    perPage: 25,
  };

  try {
    const result = await aniListRequest<Query>(FIND_CHARACTER_NAME, variables);
    const names: string[] = [];
    const characters = result?.Page?.characters ?? [];
    for (const character of characters) {
      if (character?.name?.native) {
        names.push(character.name.native);
      }
      if (character?.name?.full) {
        names.push(character.name.full);
      }
      if (character?.name?.alternative) {
        const alternatives = character?.name?.alternative ?? [];
        names.push(...alternatives);
      }
    }

    return names;
  } catch (error) {
    logger.error(`Error when finding character names`, { error });
    return [];
  }
};

export const findCharacter = async (query: string): Promise<Character[] | undefined> => {
  const variables = {
    query,
    page: 1,
    perPage: 10,
  };

  try {
    const result = await aniListRequest<Query>(FIND_CHARACTER, variables);
    return result.Page?.characters;
  } catch (error) {
    logger.error(`Error when finding character by name`, { error });
  }
};
