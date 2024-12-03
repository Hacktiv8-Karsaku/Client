import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { gql, useMutation, useQuery } from '@apollo/client';
import * as Calendar from 'expo-calendar';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { GET_RECOMMENDATIONS, REGENERATE_TODOS } from '../graphql/queries';

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
  const [regenerateTodos, { loading: regenerating }] = useMutation(REGENERATE_TODOS);

  const savedTodos = savedTodosData?.getSavedTodos || [];

  const handleRegenerateTodos = async () => {
    try {
      await regenerateTodos({
        refetchQueries: [{ query: GET_RECOMMENDATIONS }],
      });
      Alert.alert('Success', 'Todo list has been regenerated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to regenerate todo list');
    }
  };

  const handleSaveTodo = async (todo) => {
    try {
      await saveTodo({
        variables: { todoItem: todo },
        refetchQueries: [{ query: GET_SAVED_TODOS }],
      });

      const calendarStatus = await Calendar.requestCalendarPermissionsAsync();
      if (calendarStatus.status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find(cal => cal.allowsModifications);
        
        if (defaultCalendar) {
          await Calendar.createEventAsync(defaultCalendar.id, {
            title: todo,
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + 30 * 60 * 1000),
            timeZone: 'GMT',
          });
        }
      }
    } catch (error) {
      Alert.alert('Error saving todo', error.message);
    }
  };

  const renderTodoItem = (todo, index) => {
    const isSaved = savedTodos.includes(todo);
    const animations = ['fadeInLeft', 'fadeInRight'];
    const animation = animations[index % 2];

    return (
      <Animatable.View
        animation={animation}
        delay={index * 100}
        style={styles.cardContainer}
        key={index}
      >
        <LinearGradient
          colors={isSaved ? ['#BDE0FE', '#A2D2FF'] : ['#FFB5A7', '#FF9A8A']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.todoContent}>
            <Feather 
              name={isSaved ? "check-circle" : "circle"} 
              size={24} 
              color="#FFF" 
              style={styles.icon}
            />
            <Text style={styles.todoText}>{todo}</Text>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSaveTodo(todo)}
          >
            <Text style={styles.saveButtonText}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animatable.View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Your Healing Journey
        </Animatable.Text>
        <ScrollView 
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {todoList?.map((todo, index) => renderTodoItem(todo, index))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.regenerateButton}
            onPress={handleRegenerateTodos}
            disabled={regenerating}
          >
            <Feather name="refresh-cw" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.regenerateButtonText}>
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#FF9A8A',
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardContainer: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 12,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 154, 138, 0.2)',
  },
  regenerateButton: {
    backgroundColor: '#BDE0FE',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#FF9A8A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonIcon: {
    marginRight: 8,
  },
  regenerateButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TodoList;
