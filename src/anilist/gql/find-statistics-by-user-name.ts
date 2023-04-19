export const FIND_STATISTICS_BY_USER_NAME = `
	query ($name: String) {
		User(name: $name) {
			id
			name
			about
			avatar {
				large
				medium
			}
			bannerImage
			options {
				profileColor
			}
			statistics {
				anime {
					count
					meanScore
					standardDeviation
					minutesWatched
					episodesWatched
					formats {
						count
						format
					}
					statuses {
						count
						status
					}
					releaseYears {
						count
						releaseYear
					}
					startYears {
						count
						startYear
					}
					genres {
						count
						genre
						meanScore
						minutesWatched
					}
					tags {
						count
						tag {
							id
							name
						}
						meanScore
						minutesWatched
					}
				}
				manga {
					count
					meanScore
					standardDeviation
					chaptersRead
					volumesRead
					statuses {
						count
						status
					}
					releaseYears {
						count
						releaseYear
					}
					startYears {
						count
						startYear
					}
					genres {
						count
						genre
						meanScore
						chaptersRead
					}
					tags {
						count
						tag {
							id
							name
						}
						meanScore
						chaptersRead
					}
				}
			}
			siteUrl
			updatedAt
		}
	}
`;
