import { characterToCard, findCharacter, findCharacterNames } from '../anilist/character';
import { lookupCommand } from './command';

export const character = lookupCommand({
  name: 'character',
  notFound: 'Unable to find character.',
  find: findCharacter,
  toCard: characterToCard,
  search: findCharacterNames
});
