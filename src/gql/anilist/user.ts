import { request } from '@ninetailed/cf-worker-graphql-request';
import { ANILIST_ENDPOINT } from './anilist.js';

const findUserName = `
  query ($page: Int, $perPage: Int, $query: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      users(search: $query) {
        name
      }
    }
  }
`;

export const findUserByName = async (username: string): Promise<any> => {
  const query = `
    query ($name: String) {
      User(name: $name) {
        id
        name
      }
    }
  `;
  const variables = {
    name: username,
  };

  try {
    return await request(ANILIST_ENDPOINT, query, variables);
  } catch (err) {
    console.error(err);
    return null;
  }
};
