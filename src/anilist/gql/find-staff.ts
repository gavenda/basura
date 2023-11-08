export const FIND_STAFF = `
	query ($page: Int, $perPage: Int, $query: String) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				currentPage
				lastPage
				hasNextPage
				perPage
			}
			staff(search: $query) {
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
				description
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
	}
`;
