import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { gql, useQuery } from '@apollo/client';

const GET_RECOMMENDATIONS = gql`
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

const Recommendations = () => {
  const { loading, error, data } = useQuery(GET_RECOMMENDATIONS);

  if (loading) return <ActivityIndicator size="large" color="#FF9A8A" />;
  if (error) return <Text>Error loading recommendations</Text>;

  const { todoList, places, foods } = data?.getUserProfile?.recommendations || {};

  return (
    <ScrollView style={styles.container}>
      {/* Todo List Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's To-Do List</Text>
        {todoList?.map((todo, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Text style={styles.cardText}>{todo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Places Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Places</Text>
        {places?.map((place, index) => (
          <TouchableOpacity key={index} style={styles.cardLarge}>
            <Text style={styles.cardTitle}>{place.name}</Text>
            <Text style={styles.cardDescription}>{place.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Foods Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Food Recommendations</Text>
        {foods?.map((food, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Text style={styles.cardText}>{food}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4267B2',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLarge: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#4267B2',
  },
  cardText: {
    fontSize: 14,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default Recommendations; 