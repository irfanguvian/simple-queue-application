import { GraphQLClient } from 'graphql-request';

// Initialize the GraphQL client with your API endpoint
const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    // Add any required headers here
  },
});

export default graphQLClient;

// GraphQL mutations for the queue system
export const MUTATIONS = {
  START_QUEUEING: `
    mutation StartQueueing($productCode: String) {
      startQueueing(productCode: $productCode) {
        success
        message
        data {
          queueId
        }
      }
    }
  `,
  CHECK_QUEUE_STATUS: `
    mutation CheckQueueStatus($queueId: String) {
      checkQueueStatus(queueId: $queueId) {
        success
        message
        data {
          queue_id
          is_available
          estimated_time
        }
      }
    }
  `,
  ENTER_QUEUE_ROOM: `
    mutation EnterQueueRoom($queueId: String) {
      enterQueueRoom(queueId: $queueId) {
        success
        message
      }
    }
  `
};