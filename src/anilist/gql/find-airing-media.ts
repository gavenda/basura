export const FIND_AIRING_MEDIA = `
	query ($mediaId: Int) {
		Page(page: 1, perPage: 1) {
			pageInfo {
				total
				currentPage
				lastPage
				hasNextPage
				perPage
			}
			airingSchedules(mediaId: $mediaId, sort: EPISODE_DESC, notYetAired: false) {
				id
				episode
				mediaId
				media {
					title {
						english
						romaji
						native
					}
          status
					coverImage {
						extraLarge
					}
					siteUrl
				}
			}
		}
	}
`;
