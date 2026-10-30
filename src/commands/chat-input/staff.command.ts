import { staffLookup } from '../../discord/lookups';
import { lookupCommand } from './lookup-command';

export const staffCommand = lookupCommand(staffLookup, {
  description: 'Looks up the name of an anime/manga staff.',
  option: 'Name of the anime/manga staff.'
});
