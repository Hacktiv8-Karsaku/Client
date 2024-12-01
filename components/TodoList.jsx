import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { gql, useMutation, useQuery } from '@apollo/client';
import * as Calendar from 'expo-calendar';
import * as Animatable from 'react-native-animatable'; // Import animasi

const GET_SAVED_TODOS = gql`
  query GetSavedTodos {
    getSavedTodos
  }
`;

const SAVE_TODO = gql`
  mutation SaveTodoItem($todoItem: String!) {
    saveTodoItem(todoItem: $todoItem) {
      _id
      savedTodos
    }
  }
`;

const TodoList = ({ todoList, visible, onClose }) => {
  const { data: savedTodosData } = useQuery(GET_SAVED_TODOS);
  const [saveTodo] = useMutation(SAVE_TODO);

  const savedTodos = savedTodosData?.getSavedTodos || [];

  const handleSaveTodo = async (todo) => {
    try {
      const { data } = await saveTodo({
        variables: { todoItem: todo },
        refetchQueries: [{ query: GET_SAVED_TODOS }],
      });

      // Request Calendar permissions
      const calendarStatus = await Calendar.requestCalendarPermissionsAsync();
      if (calendarStatus.status === 'granted') {
        // Add calendar entry for saved todo
        const event = await Calendar.createEventAsync(Calendar.DEFAULT, {
          title: todo,
          startDate: new Date(),
          endDate: new Date(new Date().getTime() + 30 * 60 * 1000),
          timeZone: 'GMT',
        });
        console.log(`Event created with ID: ${event}`);
      }
    } catch (error) {
      Alert.alert('Error saving todo', error.message);
    }
  };

  const renderTodoItem = (todo, index) => {
    const isSaved = savedTodos.includes(todo);

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 100} // Animasi berurutan dengan jeda 100ms
        style={styles.card}
        key={index}
      >
        <Text style={styles.todoText}>{todo}</Text>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: isSaved ? '#BDE0FE' : '#FF9A8A' },
          ]}
          onPress={() => handleSaveTodo(todo)}
        >
          <Text style={styles.saveButtonText}>
            {isSaved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Your To-Do List</Text>
        <View style={styles.listContainer}>
          {todoList?.map((todo, index) => renderTodoItem(todo, index))}
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    flex: 1,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFF9F5',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF9A8A',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TodoList;
