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
        year
        allTime
        season
      }
      type
      format
      status
      source(version: 3)
      description(asHtml: true)
      characters(sort: RELEVANCE, perPage: 5) {
        edges {
          role
          node {
            name {
              full
              native
            }
            siteUrl
          }
        }
      }
      hashtag
      countryOfOrigin
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
