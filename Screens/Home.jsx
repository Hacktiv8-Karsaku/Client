import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@apollo/client";
import ImageCard from "../components/imageCard";
import { GET_RECOMMENDATIONS } from "../graphql/queries";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const HomePage = () => {
  const { loading, error, data } = useQuery(GET_RECOMMENDATIONS);
  const { todoList, places, foods } =
    data?.getUserProfile?.recommendations || {};
  const navigation = useNavigation();

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

          {/* What's New section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's New?</Text>
            <ImageCard
              imageUrl="https://inixindojogja.co.id/wp-content/uploads/2024/03/thumbnail-artikel-2024-03-27T101305.322.jpg"
              title="New Feature Update"
            />
            <ImageCard
              imageUrl="https://wallpapers.com/images/hd/doctor-back-view-6gzrdkpscth1bn3v.jpg"
              title="Upcoming Events"
            />
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

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.videoCallButton}
              onPress={async () => {
                const userId = await SecureStore.getItemAsync("user_id");
                if (userId) {
                  navigation.navigate("DoctorSelection");
                } else {
                  Alert.alert("Error", "User not logged in");
                }
              }}
            >
              <Text style={styles.videoCallButtonText}>Start Video Consultation</Text>
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

          {/* Places Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Healing Activity / Destination
            </Text>
            {places?.map((place, index) => (
              <ImageCard
                key={index}
                imageUrl="https://baysport.com/blog/wp-content/uploads/2019/07/backlit-beach-dawn-dusk-588561-1.jpg"
                title={place.name}
              />
            ))}
            <Text style={styles.seeAll}>See All</Text>
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
  videoCallButton: {
    backgroundColor: '#4267B2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  videoCallButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomePage;
