export const FIND_STAFF_NAME = `
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
			}
		}
	}
`;
