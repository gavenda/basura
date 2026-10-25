import gqlmin from 'gqlmin';

// Result types for these queries are generated into ./types.ts. Run `bun run codegen` after editing.

export const findMediaTitlesQuery = gqlmin(/* GraphQL */ `
  query FindMediaTitles($search: String, $mediaType: MediaType) {
    Page(perPage: 25) {
      media(type: $mediaType, search: $search) {
        id
        countryOfOrigin
        title {
          native
          romaji
          english
        }
      }
    }
  }
`);

export const findMediaQuery = gqlmin(/* GraphQL */ `
  query FindMedia($mediaId: Int, $mediaType: MediaType) {
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
      season
      seasonYear
      episodes
      chapters
      synonyms
      coverImage {
        extraLarge
      }
      bannerImage
      genres
      meanScore
      favourites
      siteUrl
    }
  }
`);

export const findMediaListEntriesQuery = gqlmin(/* GraphQL */ `
  query FindMediaListEntries($userIds: [Int], $mediaId: Int) {
    Page(perPage: 50) {
      mediaList(userId_in: $userIds, mediaId: $mediaId) {
        userId
        status
        score(format: POINT_100)
        progress
      }
    }
  }
`);

export const findCharacterNamesQuery = gqlmin(/* GraphQL */ `
  query FindCharacterNames($search: String) {
    Page(perPage: 25) {
      characters(search: $search) {
        id
        name {
          full
          native
        }
      }
    }
  }
`);

export const findCharacterQuery = gqlmin(/* GraphQL */ `
  query FindCharacter($characterId: Int) {
    Character(id: $characterId) {
      gender
      name {
        full
        native
        alternative
      }
      image {
        large
        medium
      }
      dateOfBirth {
        year
        month
        day
      }
      description(asHtml: true)
      siteUrl
      media(perPage: 5) {
        edges {
          characterRole
          node {
            title {
              english
              romaji
            }
            format
            type
            siteUrl
          }
        }
      }
      favourites
    }
  }
`);

export const findStaffNamesQuery = gqlmin(/* GraphQL */ `
  query FindStaffNames($search: String) {
    Page(perPage: 25) {
      staff(search: $search) {
        id
        name {
          full
          native
        }
      }
    }
  }
`);

export const findStaffQuery = gqlmin(/* GraphQL */ `
  query FindStaff($staffId: Int) {
    Staff(id: $staffId) {
      name {
        full
        native
        alternative
      }
      gender
      dateOfBirth {
        year
        month
        day
      }
      image {
        large
        medium
      }
      description(asHtml: true)
      siteUrl
      characters(perPage: 5) {
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
      staffMedia(perPage: 5) {
        edges {
          staffRole
          node {
            title {
              english
              romaji
              native
            }
            siteUrl
          }
        }
      }
      favourites
    }
  }
`);
