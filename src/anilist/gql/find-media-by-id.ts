import gqlmin from 'gqlmin';

export const findMediaByIdQuery = gqlmin(`
  query ($mediaId: Int, $mediaType: MediaType) {
    Media(id: $mediaId, type: $mediaType) {
      id
      title {
        english
        romaji
        native
      }
      rankings {
        type
        rank
        allTime
      }
      type
      format
      status
      description
      season
      seasonYear
      episodes
      duration
      chapters
      volumes
      synonyms
      coverImage {
        extraLarge
      }
      bannerImage
      genres
      synonyms
      meanScore
      popularity
      favourites
      siteUrl
    }
  }
`);
