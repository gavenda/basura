export const FIND_MEDIA = `
	query ($page: Int, $perPage: Int, $query: String, $type: MediaType, $genreNotIn: [String]) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				currentPage
				lastPage
				hasNextPage
				perPage
			}
			media(search: $query, type: $type, genre_not_in: $genreNotIn) {
				id
				idMal
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
	}
`;
