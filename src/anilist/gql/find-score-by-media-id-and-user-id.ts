export const FIND_SCORE_BY_MEDIA_ID_AND_USER_ID = `
	query ($userId: [Int], $mediaId: [Int], $page: Int, $perPage: Int) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				currentPage
				lastPage
				hasNextPage
				perPage
			}

			mediaList(userId_in: $userId, mediaId_in: $mediaId) {
				score(format: POINT_100)
				status
				progress
				repeat
				user {
					id
					name
				}
				mediaId
			}
		}
	}
`;
