import gqlmin from 'gqlmin';

export const findMediaListByUserIdsAndMediaIdQuery = gqlmin(`
  query ($userIds: [Int], $mediaId: Int) {
    Page(perPage: 25) {
      mediaList(userId_in: $userIds, mediaId: $mediaId) {
        score(format: POINT_100)
        status
        progress
        repeat
        user {
          id
          name
        }
        mediaId
        userId
      }
    }
  }
`);
