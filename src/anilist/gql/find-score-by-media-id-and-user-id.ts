export const FIND_SCORE_BY_MEDIA_ID_AND_USER_ID = `
	query ($userIds: [Int], $mediaIds: [Int], $page: Int, $perPage: Int) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				currentPage
				lastPage
				hasNextPage
				perPage
			}

			mediaList(userId_in: $userIds, mediaId_in: $mediaIds) {
				score(format: POINT_100)
				status
				progress
				repeat
				user {
					id
					name
				}
				userId
				mediaId
			}
		}
	}
`;
