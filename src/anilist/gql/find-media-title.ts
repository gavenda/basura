import gqlmin from 'gqlmin';

export const findMediaTitleQuery = gqlmin(`
  query ($search: String, $mediaType: MediaType) {
    Page(perPage: 25) {
      pageInfo {
        total
      }
      media(type: $mediaType, search: $search) {
        id
        title {
          native
          romaji
          english
        }
        synonyms
      }
    }
  }
`);
