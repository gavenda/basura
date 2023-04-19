export const FIND_USER_NAME = `
	query ($page: Int, $perPage: Int, $query: String) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				currentPage
				lastPage
				hasNextPage
				perPage
			}
			users(search: $query) {
				name
			}
		}
	}
`;
