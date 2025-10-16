import gqlmin from 'gqlmin';

export const findCharacterNameQuery = gqlmin(`
	query ($search: String) {
		Page(perPage: 25) {
			pageInfo {
				total
			}
			characters(search: $search) {
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
