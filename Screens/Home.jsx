import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@apollo/client";
import ImageCard from "../components/imageCard";
import MapDisplay from "../components/MapView";
import { GET_RECOMMENDATIONS } from "../graphql/queries";

const HomePage = () => {
  const { loading, error, data } = useQuery(GET_RECOMMENDATIONS);
  const { todoList, places, foods } =
    data?.getUserProfile?.recommendations || {};

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

          <View style={styles.navBar}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navText}>To Do List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navText}>Mood Tracker</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navText}>Calories Tracker</Text>
            </TouchableOpacity>
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
            <Text style={styles.seeAll}>See All</Text>
          </View>

          {/* Places Cards Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Healing Activity / Destination
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FF9A8A" />
            ) : places && places.length > 0 ? (
              <>
                {places.map((place, index) => (
                  <ImageCard
                    key={index}
                    imageUrl="https://baysport.com/blog/wp-content/uploads/2019/07/backlit-beach-dawn-dusk-588561-1.jpg"
                    title={place.name}
                    description={place.description}
                  />
                ))}
                <Text style={styles.seeAll}>See All</Text>
              </>
            ) : (
              <Text>No places available</Text>
            )}
          </View>

          {/* Foods Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food Recommendations</Text>
            {foods?.slice(0, 2).map((food, index) => (
              <ImageCard
                key={index}
                imageUrl="https://www.gbhamericanhospital.com/wp-content/uploads/2022/08/360_F_269205000_FAvWjPBVLruUEoVzmm3nNdch9mSFdzLj.jpg"
                title={food}
              />
            ))}
            <Text style={styles.seeAll}>See All</Text>
          </View>
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
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    backgroundColor: "#FF9A8A",
    borderRadius: 8,
  },
  navText: {
    color: "#FFFFFF",
    fontWeight: "bold",
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
  description: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 4,
  },
});

export default HomePage;
