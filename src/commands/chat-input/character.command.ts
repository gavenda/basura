import { characterLookup } from '../../discord/lookups';
import { lookupCommand } from './lookup-command';

export const characterCommand = lookupCommand(characterLookup, {
  description: 'Looks up the name of an anime/manga character.',
  option: 'Name of the anime/manga character.'
});
