import gqlmin from 'gqlmin';

export const findStaffQuery = gqlmin(`
	query ($staffId: Int) {
		Staff(id: $staffId) {
			id
			name {
				full
				native
				alternative
			}
			languageV2
			image {
				large
			}
			description(asHtml: true)
			siteUrl
			staffMedia {
				nodes {
					title {
						english
						romaji
					}
					siteUrl
				}
				edges {
					staffRole
				}
			}
			characters {
				nodes {
					name {
						full
						native
					}
					siteUrl
				}
				edges {
					role
				}
			}
			favourites
		}
	}
`);
