import { aniListRequest } from './anilist.js';
import { FIND_STATISTICS_BY_USER_NAME } from './gql/find-statistics-by-user-name.js';
import { FIND_USER_BY_NAME } from './gql/find-user-by-name.js';

export const findUserByName = async (name: string): Promise<any> => {
  const variables = { name };

  try {
    const result = await aniListRequest<any>(FIND_USER_BY_NAME, variables);
    return result.User;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const findUserStatisticsByName = async (name: string): Promise<any> => {
  const variables = { name };

  try {
    const result = await aniListRequest<any>(FIND_STATISTICS_BY_USER_NAME, variables);
    return result.User;
  } catch (err) {
    console.error(err);
    return null;
  }
};
