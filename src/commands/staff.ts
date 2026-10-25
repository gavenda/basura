import { findStaff, findStaffNames, staffToCard } from '../anilist/staff';
import { lookupCommand } from './command';

export const staff = lookupCommand({
  name: 'staff',
  notFound: 'Unable to find staff.',
  find: findStaff,
  toCard: staffToCard,
  search: findStaffNames
});
