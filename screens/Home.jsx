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
import { useQuery } from "@apollo/client";
import ImageCard from "../components/ImageCard";
import MapDisplay from "../components/MapView";
import { GET_RECOMMENDATIONS } from "../graphql/queries";
import TodoList from "../components/TodoList";
import VideoRecommendations from "../components/VideoRecommendations";

const HomePage = () => {
  const { loading, error, data } = useQuery(GET_RECOMMENDATIONS);
  const { todoList, places, foodVideos } =
    data?.getUserProfile?.recommendations || {};
  const [todoListVisible, setTodoListVisible] = useState(false);

  const renderPlaceCard = ({ item }) => (
    <ImageCard
      imageUrl="https://baysport.com/blog/wp-content/uploads/2019/07/backlit-beach-dawn-dusk-588561-1.jpg"
      title={item.name}
      description={item.description}
      style={styles.horizontalCard}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
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
            <Text style={styles.sectionTitle}>Preview To Do List</Text>
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

          {/* Places Cards Section - Horizontal Scroll */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Healing Activity / Destination
            </Text>
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
                <Text style={styles.seeAll}>See All</Text>
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
    padding: 16,
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
    marginTop: 8,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 8,
  },
  horizontalCard: {
    marginRight: 12,
    width: 250,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 8,
  },
  horizontalCard: {
    marginRight: 12,
    width: 250,
  },
});

export default HomePage;
