import { aniListRequest } from './anilist.js';
import { FIND_STAFF } from './gql/find-staff.js';

export const findStaff = async (query: string): Promise<any> => {
  const variables = {
    query,
    page: 1,
    perPage: 10,
  };

  try {
    const result = await aniListRequest<any>(FIND_STAFF, variables);
    return result.Page?.characters;
  } catch (err) {
    console.error(err);
    return null;
  }
};
