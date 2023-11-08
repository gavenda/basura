export const FIND_MEDIA_NAME = `
	query ($page: Int, $perPage: Int, $type: MediaType, $query: String, $genreNotIn: [String]) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				currentPage
				lastPage
				hasNextPage
				perPage
			}
			media(type: $type, search: $query, genre_not_in: $genreNotIn) {
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
