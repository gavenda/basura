import gqlmin from 'gqlmin';

export const findCharacterQuery = gqlmin(`
	query ($characterId: Int) {
    Character(id: $characterId) {
      id
      gender
      name {
        full
        native
        alternative
      }
      image {
        medium,
        large
      }
      dateOfBirth {
        year
        month
        day
      }
      description(asHtml: true)
      siteUrl
      media {
        nodes {
          id
          title {
            english
            romaji
            native
          }
          format
          type
          siteUrl
        }
        edges {
          characterRole
        }
      }
      favourites
    }
  }
`);
