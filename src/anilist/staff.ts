import { logger } from '@logger/logger';
import { aniListRequest } from './anilist.js';
import { FIND_STAFF_NAME } from './gql/find-staff-name.js';
import { FIND_STAFF } from './gql/find-staff.js';
import { Query, Staff } from './gql/types.js';

export const findStaff = async (query: string): Promise<Staff[] | undefined> => {
  const variables = {
    query,
    page: 1,
    perPage: 10,
  };

  try {
    const result = await aniListRequest<Query>(FIND_STAFF, variables);
    return result.Page?.staff;
  } catch (error) {
    logger.error(`Error when finding staff by name`, { error });
  }
};

export const findStaffByName = async (query: string): Promise<string[]> => {
  const variables = {
    query,
    page: 1,
    perPage: 25,
  };

  try {
    const result = await aniListRequest<Query>(FIND_STAFF_NAME, variables);
    const names: string[] = [];
    const staffs = result?.Page?.staff ?? [];
    for (const staff of staffs) {
      if (staff?.name?.native) {
        names.push(staff.name.native);
      }
      if (staff?.name?.full) {
        names.push(staff.name.full);
      }
      if (staff?.name?.alternative) {
        const alternatives = staff?.name?.alternative ?? [];
        names.push(...alternatives);
      }
    }
    return names;
  } catch (error) {
    logger.error(`Error when finding staff names`, { error });
  }
  return [];
};
