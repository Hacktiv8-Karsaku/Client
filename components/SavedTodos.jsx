import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_SAVED_TODOS = gql`
  query GetSavedTodos {
    getSavedTodos
  }
`;

const SavedTodos = () => {
  const { loading, error, data } = useQuery(GET_SAVED_TODOS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading saved todos</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Todo Items</Text>
      <ScrollView style={styles.todoList}>
        {data?.getSavedTodos?.map((todo, index) => (
          <View key={index} style={styles.todoItem}>
            <Text style={styles.todoText}>{todo}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FF9A8A',
  },
  todoList: {
    maxHeight: 200,
  },
  todoItem: {
    backgroundColor: '#FFF5F3',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FF9A8A',
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SavedTodos; 