import gqlmin from 'gqlmin';

export const findStaffNameQuery = gqlmin(`
	query ($search: String) {
		Page(perPage: 25) {
			staff(search: $search) {
				id
				name {
					full
					native
					alternative
				}
			}
		}
	}
`);
