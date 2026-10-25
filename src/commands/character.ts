import { characterToComponents, findCharacter, findCharacterNames } from '../anilist/character';
import { lookupCommand } from './command';

export const character = lookupCommand({
  notFound: 'Unable to find character.',
  find: findCharacter,
  render: characterToComponents,
  search: findCharacterNames
});
