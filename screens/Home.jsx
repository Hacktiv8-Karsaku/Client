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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import MapDisplay from "../components/MapView";
import { GET_RECOMMENDATIONS } from "../graphql/queries";
import TodoList from "../components/TodoList";
import DetailDestination from "../components/DetailDestination";
import VideoRecommendations from "../components/VideoRecommendations";
import { Feather } from "@expo/vector-icons";

const HomePage = () => {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_RECOMMENDATIONS);
  const { todoList, places, foodVideos } =
    data?.getUserProfile?.recommendations || {};
  const [todoListVisible, setTodoListVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const renderPlaceCard = ({ item }) => (
    <DetailDestination place={item} isPreview={true} />
  );

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome to Karsaku 👋</Text>
            <TouchableOpacity style={styles.dateContainer} onPress={showDatePicker}>
            <Feather name="calendar" size={24} color="#FF9A8A" />
              {/* <View style={styles.monthSection}>
                <Text style={styles.monthText}>
                  {format(selectedDate, "MMM", { locale: id })}
                </Text>
              </View>
              <View style={styles.dateSection}>
                <Text style={styles.dateText}>
                  {format(selectedDate, "dd", { locale: id })}
                </Text>
              </View> */}
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            date={selectedDate}
          />

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
            <Text style={styles.seeAll} onPress={() => setTodoListVisible(true)}>
              See All
            </Text>
          </View>

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
  dateContainer: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },
  monthSection: {
    backgroundColor: "#FF9A8A",
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  monthText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold", // Menebalkan teks bulan
  },
  dateSection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    color: "#FF9A8A",
    fontSize: 18,
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
    marginTop: 4,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  retakeButton: {
    backgroundColor: "#FF9A8A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  retakeButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default HomePage;
