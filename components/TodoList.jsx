import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { gql, useMutation, useQuery } from '@apollo/client';
import * as Calendar from 'expo-calendar';

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
        refetchQueries: [{ query: GET_SAVED_TODOS }]
      });
      
      // Request Calendar permissions
      const calendarStatus = await Calendar.requestCalendarPermissionsAsync();
      const reminderStatus = await Calendar.requestRemindersPermissionsAsync();
      
      if (calendarStatus.status === 'granted' && reminderStatus.status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];
        
        if (defaultCalendar) {
          await Calendar.createEventAsync(defaultCalendar.id, {
            title: todo,
            startDate: new Date(),
            endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
            alarms: [{ relativeOffset: -60 }]
          });
        }
      } else {
        Alert.alert('Permissions Required', 'Calendar and reminder permissions are needed to add events.');
      }
    } catch (error) {
      console.error('Error saving todo:', error);
      Alert.alert('Error', 'Failed to save todo item');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>All Todo Items</Text>
        {todoList?.map((todo, index) => (
          <View key={index} style={styles.todoItem}>
            <Text style={styles.todoText}>{todo}</Text>
            <TouchableOpacity 
              style={[
                styles.saveButton,
                savedTodos.includes(todo) && styles.savedButton
              ]}
              onPress={() => handleSaveTodo(todo)}
              disabled={savedTodos.includes(todo)}
            >
              <Text style={styles.buttonText}>
                {savedTodos.includes(todo) ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF9A8A',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  savedButton: {
    backgroundColor: '#90EE90',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TodoList; 