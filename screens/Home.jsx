import React, { useEffect, useState } from "react";
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
import { useQuery, useLazyQuery } from "@apollo/client";
import MapDisplay from "../components/MapView";
import { GET_RECOMMENDATIONS } from "../graphql/queries";
import TodoList from "../components/TodoList";
import DetailDestination from "../components/DetailDestination";
import VideoRecommendations from "../components/VideoRecommendations";
import { Feather } from "@expo/vector-icons";

const HomePage = () => {
  const navigation = useNavigation();
  const [getRecommendations, { loading, error, data }] =
    useLazyQuery(GET_RECOMMENDATIONS);
  const { todoList, places, foodVideos } =
    data?.getUserProfile?.recommendations || {};
  const [todoListVisible, setTodoListVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    console.log("Fetching recommendations");
    getRecommendations({ 
      variables: { date: selectedDate.toISOString() },
      onCompleted: (data) => {
        console.log("Recommendations data:", data?.getUserProfile?.recommendations);
      },
      onError: (error) => {
        console.error("Error fetching recommendations:", error);
      }
    });
  }, [selectedDate]);

  console.log({ loading, error, data }, "data");

  const renderPlaceCard = ({ item }) => {
    console.log("Rendering place:", item); // Debug log
    return <DetailDestination place={item} isPreview={true} />;
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    console.log(date, "<<<date");

    hideDatePicker();
  };

  const handleRetakeComplete = () => {
    // Refresh recommendations data
    getRecommendations({ 
      variables: { date: selectedDate.toISOString() },
      fetchPolicy: 'network-only' // Memastikan data diambil ulang dari server
    });
  };

  const renderTodoList = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#FF9A8A" />;
    }

    if (!todoList || todoList.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No tasks for this date</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("retakeQuestions", {
                date: new Date(selectedDate).toISOString(),
                onRetakeComplete: handleRetakeComplete,
              })
            }
            style={[styles.retakeButton, styles.centerButton]}
          >
            <Text style={styles.retakeButtonText}>Generate Tasks</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {todoList.slice(0, 3).map((todo, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Text style={styles.cardText}>{todo}</Text>
          </TouchableOpacity>
        ))}
        {todoList.length > 3 && (
          <Text
            style={styles.seeAll}
            onPress={() => setTodoListVisible(true)}
          >
            See All ({todoList.length})
          </Text>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome to Karsaku 👋</Text>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={showDatePicker}
            >
              <Feather name="calendar" size={24} color="#FF9A8A" />
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
                onPress={() =>
                  navigation.navigate("retakeQuestions", {
                    date: new Date(selectedDate).toISOString(),
                    onRetakeComplete: handleRetakeComplete,
                  })
                }
                style={styles.retakeButton}
              >
                <Text style={styles.retakeButtonText}>Retake Questions</Text>
              </TouchableOpacity>
            </View>
            {renderTodoList()}
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
            date={selectedDate}
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
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  retakeButton: {
    backgroundColor: "#FF9A8A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  centerButton: {
    alignSelf: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retakeButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  placesList: {
    paddingVertical: 10,
  },
  seeAllText: {
    color: '#FF8080',
    fontSize: 14,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default HomePage;
