import { animeLookup } from '../../discord/lookups';
import { lookupCommand } from './lookup-command';

export const animeCommand = lookupCommand(animeLookup, {
  description: 'Looks up the name of the anime.',
  option: 'Name of the anime.'
});
