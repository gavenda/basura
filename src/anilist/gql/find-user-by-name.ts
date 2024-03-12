export const FIND_USER_BY_NAME = `
	query ($name: String) {
		User(name: $name) {
			id
			name
		}
	}
`;
