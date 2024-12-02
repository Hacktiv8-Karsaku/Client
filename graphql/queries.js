import { gql } from "@apollo/client";

export const GET_SAVED_TODOS = gql`
  query GetSavedTodos {
    getSavedTodos
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodoItem($todoItem: String!) {
    deleteTodoItem(todoItem: $todoItem) {
      _id
      savedTodos
    }
  }
`;

export const GET_RECOMMENDATIONS = gql`
  query GetRecommendations {
    getUserProfile {
      recommendations {
        todoList
        places {
          name
          description
        }
        foodVideos {
          title
          url
          thumbnail
          description
        }
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      _id
      name
      username
      email
    }
  }
`; 

export const GET_DESTINATIONS = gql`
  query GetDestinations {
    getDestinations {
      id
      name
      imageUrl
      rating
      description
    }
  }
`;

export const REGENERATE_TODOS = gql`
  mutation RegenerateTodos {
    regenerateTodos {
      recommendations {
        todoList
      }
    }
  }
`;
