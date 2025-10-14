export const FIND_MEDIA_NAME = `
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
`;
