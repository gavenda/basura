export const FIND_CHARACTER_NAME = `
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
			}
		}
	}
`;
