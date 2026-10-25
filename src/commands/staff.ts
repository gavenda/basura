import { findStaff, findStaffNames, staffToComponents } from '../anilist/staff';
import { lookupCommand } from './command';

export const staff = lookupCommand({
  notFound: 'Unable to find staff.',
  find: findStaff,
  render: staffToComponents,
  search: findStaffNames
});
