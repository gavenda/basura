import { aniListRequest } from './anilist.js';
import { FIND_CHARACTER_NAME } from './gql/find-character-name.js';
import { FIND_CHARACTER } from './gql/find-character.js';

export const findCharacterNames = async (query: string): Promise<string[]> => {
  const variables = {
    query,
    page: 1,
    perPage: 10,
  };

  try {
    const result = await aniListRequest<any>(FIND_CHARACTER_NAME, variables);
    const names = [];
    for (const character of result.Page.characters) {
      if (character.name.native) {
        names.push(character.name.native);
      }
      if (character.name.full) {
        names.push(character.name.full);
      }
      if (character.name.alternative) {
        names.push(...character.name.alternative);
      }
    }

    return names;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const findCharacter = async (query: string): Promise<any> => {
  const variables = {
    query,
    page: 1,
    perPage: 10,
  };

  try {
    const result = await aniListRequest<any>(FIND_CHARACTER, variables);
    return result.Page?.characters;
  } catch (err) {
    console.error(err);
    return null;
  }
};
