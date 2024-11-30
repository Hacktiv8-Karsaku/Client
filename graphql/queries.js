import { gql } from '@apollo/client';

export const GET_RECOMMENDATIONS = gql`
  query GetUserRecommendations {
    getUserProfile {
      recommendations {
        todoList
        places {
          name
          description
        }
        foods
      }
    }
  }
`; 