import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import ImageCard from "../components/ImageCard";
import MapDisplay from "../components/MapView";
import Destination from "../screens/Destination";
import { GET_RECOMMENDATIONS } from "../graphql/queries";
import TodoList from "../components/TodoList";
import DetailDestination from "../components/DetailDestination";
import VideoRecommendations from "../components/VideoRecommendations";
import ChatWithProfessionalButton from '../components/ChatWithProfessionalButton';

const HomePage = () => {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_RECOMMENDATIONS);
  const { todoList, places, foodVideos } =
    data?.getUserProfile?.recommendations || {};
  const [todoListVisible, setTodoListVisible] = useState(false);

  console.log("Places data in MapView:", places);
  console.log("First place coordinates:", places?.[0]?.coordinates);

  const renderPlaceCard = ({ item }) => (
    <DetailDestination
      place={item}
      isPreview={true}
    />
  );

  console.log("Places data:", places);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome to Karsaku 👋</Text>
            <TouchableOpacity style={styles.circle}>
              <View style={styles.circle} />
            </TouchableOpacity>
          </View>

          {/* Places Section with Map */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Healing Places</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FF9A8A" />
            ) : (
              <MapDisplay places={places} />
            )}
          </View>

          {/* Todo List Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Preview To Do List</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate("Questions")}
                style={styles.retakeButton}
              >
                <Text style={styles.retakeButtonText}>Retake Questions</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#FF9A8A" />
            ) : (
              todoList?.slice(0, 3).map((todo, index) => (
                <TouchableOpacity key={index} style={styles.card}>
                  <Text style={styles.cardText}>{todo}</Text>
                </TouchableOpacity>
              ))
            )}
            <Text
              style={styles.seeAll}
              onPress={() => setTodoListVisible(true)}
            >
              See All
            </Text>
          </View>
          <ChatWithProfessionalButton />

          {/* Places Cards Section - Horizontal Scroll */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Healing Activity / Destination</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FF9A8A" />
            ) : places && places.length > 0 ? (
              <>
                <FlatList
                  data={places}
                  renderItem={renderPlaceCard}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContainer}
                />
                <TouchableOpacity 
                  onPress={() => navigation.navigate("Destination")} 
                  style={styles.seeAll}
                >
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>No places available</Text>
            )}
          </View>

          {/* Food Video Recommendations Section - Horizontal Scroll */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food Video Recommendations</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FF9A8A" />
            ) : (
              <VideoRecommendations videos={foodVideos} />
            )}
          </View>

          <TodoList
            todoList={todoList}
            visible={todoListVisible}
            onClose={() => setTodoListVisible(false)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  circle: {
    width: 40,
    height: 40,
    backgroundColor: "#FF9A8A",
    borderRadius: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  card: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 8,
  },
  cardText: {
    color: "#333333",
  },
  seeAll: {
    textAlign: "right",
    color: "#FF9A8A",
    marginTop: 4,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 8,
  },
  horizontalCard: {
    marginRight: 12,
    width: 250,
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardRating: {
    fontSize: 14,
    color: "#FF9A8A",
  },
  cardDescription: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  cardContainer: {
    marginHorizontal: 8,
    width: 250,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  imageContainer: {
    width: "100%",
    height: 150,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  retakeButton: {
    backgroundColor: '#FF9A8A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  retakeButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomePage;
