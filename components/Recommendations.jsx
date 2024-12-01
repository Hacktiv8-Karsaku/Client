import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_RECOMMENDATIONS } from "../graphql/queries";
import MapDisplay from "./MapView";
import VideoRecommendations from "./VideoRecommendations";

const PlaceCard = ({ place }) => (
  <TouchableOpacity style={styles.placeCard}>
    <Image
      source={{ uri: "https://via.placeholder.com/150" }}
      style={styles.placeImage}
    />
    <View style={styles.placeInfo}>
      <Text style={styles.placeName}>{place.name}</Text>
      <Text style={styles.placeDescription}>{place.description}</Text>
    </View>
  </TouchableOpacity>
);

const Recommendations = () => {
  const { loading, error, data } = useQuery(GET_RECOMMENDATIONS);

  if (loading) return <ActivityIndicator size="large" color="#FF9A8A" />;
  if (error) return <Text>Error loading recommendations</Text>;

  const { todoList, places, foodVideos } =
    data?.getUserProfile?.recommendations || {};

  return (
    <ScrollView style={styles.container}>
      {/* Todo List Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's To-Do List</Text>
        {todoList?.map((todo, index) => (
          <TouchableOpacity key={index} style={styles.todoCard}>
            <Text style={styles.todoText}>{todo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Places Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Places</Text>
        <MapDisplay places={places} />
        {places?.map((place, index) => (
          <TouchableOpacity key={index} style={styles.cardLarge}>
            <Text style={styles.cardTitle}>{place.name}</Text>
            <Text style={styles.cardDescription}>{place.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Food Video Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Food Video Recommendations</Text>
        {foodVideos?.map((video, index) => (
          <VideoRecommendations key={index} videos={[video]} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  // Todo Cards
  todoCard: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  // Place Cards
  placeCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  placeImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#E1E1E1",
  },
  placeInfo: {
    padding: 16,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  placeDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  // Food Cards
  foodCard: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  foodText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Recommendations;
