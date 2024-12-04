import { gql } from "@apollo/client";

export const GET_SAVED_TODOS = gql`
  query GetSavedTodos($date: String) {
    getSavedTodos(date: $date) {
      todoItem
      date
      status
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodoItem($todoItem: String) {
    deleteTodoItem(todoItem: $todoItem) {
      _id
      savedTodos {
        todoItem
        date
        status
      }
    }
  }
`;

export const GET_RECOMMENDATIONS = gql`
  query GetUserProfile($date: String) {
    getUserProfile(date: $date) {
      avoidedFoods
      _id
      dailyActivities
      domicile
      createdAt
      lastQuestionDate
      preferredFoods
      stressLevel
      recommendations {
        todoList
        places {
          name
          description
          address
          coordinates {
            lat
            lng
          }
        }
        foodVideos {
          title
          url
          thumbnail
          description
        }
      }
      email
      job
      name
      password
      updatedAt
      username
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
      job
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
  mutation RegenerateTodos($date: String) {
    regenerateTodos(date: $date) {
      recommendations {
        todoList
      }
    }
  }
`;

export const UPDATE_TODO_STATUS = gql`
  mutation UpdateTodoStatus($todoItem: String, $status: String) {
    updateTodoStatus(todoItem: $todoItem, status: $status) {
      _id
    }
  }
`;
