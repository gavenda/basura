import { aniListRequest } from './anilist';
import { FIND_STATISTICS_BY_USER_NAME } from './gql/find-statistics-by-user-name';
import { FIND_USER_BY_NAME } from './gql/find-user-by-name';
import { FIND_USER_NAME } from './gql/find-user-name';
import { Query, User } from './gql/types';

export const findUserByName = async (name: string): Promise<User | undefined> => {
  const variables = { name };

  try {
    const result = await aniListRequest<Query>(FIND_USER_BY_NAME, variables);
    return result.User;
  } catch (error) {
    console.error(`Error when finding user by name`, { error });
  }
};

export const findUserName = async (name: string): Promise<string[]> => {
  const variables = {
    name,
    page: 1,
    perPage: 25
  };

  try {
    const result = await aniListRequest<Query>(FIND_USER_NAME, variables);
    const users = result.Page?.users ?? [];
    const names: string[] = [];

    for (const user of users) {
      names.push(user.name);
    }

    return names;
  } catch (error) {
    console.error(`Error when finding usernames`, { error });
  }
  return [];
};

export const findUserStatisticsByName = async (name: string): Promise<User | undefined> => {
  const variables = { name };

  try {
    const result = await aniListRequest<Query>(FIND_STATISTICS_BY_USER_NAME, variables);
    return result.User;
  } catch (error) {
    console.error(`Error when finding user statistics by name`, { error });
  }
};
