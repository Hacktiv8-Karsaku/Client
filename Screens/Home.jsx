import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageCard from "../components/imageCard";

const HomePage = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* greetings and profile pic */}
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome, username 👋</Text>
            <TouchableOpacity style={styles.circle}>
              <View style={styles.circle} />
            </TouchableOpacity>
          </View>

          {/* what's new section */}
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
            <Text style={styles.sectionTitle}>Preview To Do List</Text>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>To do list 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>To do list 2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>To do list 3</Text>
            </TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </View>

          {/* preview healing act */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Healing Activity / Destination
            </Text>
            <ImageCard
              imageUrl="https://baysport.com/blog/wp-content/uploads/2019/07/backlit-beach-dawn-dusk-588561-1.jpg"
              title="Relaxing Spots"
            />
            <ImageCard
              imageUrl="https://i.ytimg.com/vi/YfJGplpTeTw/maxresdefault.jpg"
              title="Best Destinations"
            />
            <Text style={styles.seeAll}>See All</Text>
          </View>

          {/* food recomendation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food Recommendations</Text>
            <ImageCard
              imageUrl="https://www.gbhamericanhospital.com/wp-content/uploads/2022/08/360_F_269205000_FAvWjPBVLruUEoVzmm3nNdch9mSFdzLj.jpg"
              title="Healthy Meals"
            />
            <ImageCard
              imageUrl="https://d1qumhq2zx0vxs.cloudfront.net/ArticleImages/HealthySnacks_09-03-2016_10-14-01-AM.jpg"
              title="Nutritious Snacks"
            />
            <Text style={styles.seeAll}>See All</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  seeAll: {
    textAlign: "right",
    color: "#FF9A8A",
    marginTop: 8,
  },
});

export default HomePage;
