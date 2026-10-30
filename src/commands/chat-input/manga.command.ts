import { mangaLookup } from '../../discord/lookups';
import { lookupCommand } from './lookup-command';

export const mangaCommand = lookupCommand(mangaLookup, {
  description: 'Looks up the name of the manga.',
  option: 'Name of the manga.'
});
