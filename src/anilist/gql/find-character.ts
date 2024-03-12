export const FIND_CHARACTER = `
	query ($page: Int, $perPage: Int, $query: String) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				currentPage
				lastPage
				hasNextPage
				perPage
			}
			characters(search: $query) {
				id
				name {
					full
					native
					alternative
				}
				image {
					large
				}
				description
				siteUrl
				media {
					nodes {
						id
						title {
							english
							romaji
							native
						}
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
	}
`;
