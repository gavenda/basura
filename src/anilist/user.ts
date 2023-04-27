import { aniListRequest } from './anilist.js';
import { FIND_STATISTICS_BY_USER_NAME } from './gql/find-statistics-by-user-name.js';
import { FIND_USER_BY_NAME } from './gql/find-user-by-name.js';
import { FIND_USER_NAME } from './gql/find-user-name.js';
import { Query, User } from './gql/types.js';

export const findUserByName = async (name: string): Promise<User | undefined> => {
  const variables = { name };

  try {
    const result = await aniListRequest<Query>(FIND_USER_BY_NAME, variables);
    return result.User;
  } catch (err) {
    console.error(err);
  }
};

export const findUserName = async (name: string): Promise<string[]> => {
  const variables = {
    name,
    page: 1,
    perPage: 25,
  };

  try {
    const result = await aniListRequest<Query>(FIND_USER_NAME, variables);
    const users = result.Page?.users ?? [];
    const names: string[] = [];

    for (const user of users) {
      names.push(user.name);
    }

    return names;
  } catch (err) {
    console.error(err);
  }
  return [];
};

export const findUserStatisticsByName = async (name: string): Promise<User | undefined> => {
  const variables = { name };

  try {
    const result = await aniListRequest<Query>(FIND_STATISTICS_BY_USER_NAME, variables);
    return result.User;
  } catch (err) {
    console.error(err);
  }
};
