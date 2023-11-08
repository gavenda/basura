export const FIND_MEDIA_BY_RANKING = `
	query (
		$page: Int
		$perPage: Int
		$sort: [MediaSort]
		$season: MediaSeason
		$seasonYear: Int
		$formatIn: [MediaFormat]
		$genreNotIn: [String]
	) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				currentPage
				lastPage
				hasNextPage
				perPage
			}
			media(
				sort: $sort
				format_in: $formatIn
				season: $season
				seasonYear: $seasonYear
				genre_not_in: $genreNotIn
			) {
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
					format
					year
					season
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
