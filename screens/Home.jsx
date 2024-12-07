import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_RECOMMENDATIONS, GET_SAVED_TODOS } from "../graphql/queries";
import TodoList from "../components/TodoList";
import DetailDestination from "../components/DetailDestination";
import VideoRecommendations from "../components/VideoRecommendations";
import { Feather } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const HomePage = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [todoListVisible, setTodoListVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  
  const formattedSelectedDate = format(selectedDate, "dd/MM/yyyy");

  const [getRecommendations, { loading, error, data }] = useLazyQuery(GET_RECOMMENDATIONS);
  const { data: todosData } = useQuery(GET_SAVED_TODOS, {
    variables: { date: formattedSelectedDate },
  });

  useEffect(() => {
    getRecommendations({ 
      variables: { date: formattedSelectedDate }
    });
  }, [selectedDate]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Please allow location access to see nearby places.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setMapRegion(currentLocation);
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Could not get your current location');
      }
    })();
  }, []);

  const recommendations = data?.getUserProfile?.recommendations;
  const { todoList, places, foodVideos } = recommendations || {};

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const renderTodoList = () => {
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading todos</Text>;

    const recommendationForDate = data?.getUserProfile?.recommendationsHistory?.find(
      (history) => history.date === formattedSelectedDate
    );

    const todosForDate = recommendationForDate?.recommendations?.todoList || [];
    const savedTodosForDate = todosData?.getSavedTodos || [];
    const displayTodos = savedTodosForDate.length > 0 ? savedTodosForDate : todosForDate;

    if (displayTodos.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No tasks for this date</Text>
          <TouchableOpacity
            onPress={() => setTodoListVisible(true)}
            style={[styles.retakeButton, styles.centerButton]}
          >
            <Text style={styles.retakeButtonText}>Generate Tasks</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {displayTodos.slice(0, 3).map((todo, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.todoItem}
            onPress={() => setTodoListVisible(true)}
          >
            <View style={styles.todoLeftSection}>
              <TouchableOpacity style={styles.checkboxContainer}>
                <Feather
                  name={todo.status === "success" ? "check-square" : "square"}
                  size={20}
                  color="#FF9A8A"
                />
              </TouchableOpacity>
              <View style={styles.todoTextContainer}>
                <Text style={styles.todoText}>
                  {todo.todoItem || todo}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {displayTodos.length > 3 && (
          <TouchableOpacity onPress={() => setTodoListVisible(true)}>
            <Text style={styles.seeAllText}>
              See All ({displayTodos.length})
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderPlaceCard = ({ item }) => (
    <DetailDestination place={item} isPreview={true} />
  );

  const renderMap = () => {
    if (!mapRegion) return <ActivityIndicator size="large" color="#FF9A8A" />;

    const allCoordinates = places?.map(place => ({
      latitude: place.coordinates?.lat || parseFloat(place.latitude),
      longitude: place.coordinates?.lng || parseFloat(place.longitude),
    })) || [];

    if (userLocation) {
      allCoordinates.push(userLocation);
    }

    const calcRegion = () => {
      if (allCoordinates.length === 0) return mapRegion;

      let minLat = Math.min(...allCoordinates.map(coord => coord.latitude));
      let maxLat = Math.max(...allCoordinates.map(coord => coord.latitude));
      let minLng = Math.min(...allCoordinates.map(coord => coord.longitude));
      let maxLng = Math.max(...allCoordinates.map(coord => coord.longitude));

      const padding = 0.05;
      return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: (maxLat - minLat) + padding,
        longitudeDelta: (maxLng - minLng) + padding,
      };
    };

    return (
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={mapRegion}
          region={calcRegion()}
          showsUserLocation={false}
        >
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="You are here"
              description="Your current location"
              pinColor="#4285F4"
            />
          )}

          {places?.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.coordinates?.lat || parseFloat(place.latitude),
                longitude: place.coordinates?.lng || parseFloat(place.longitude),
              }}
              title={place.name}
              description={place.description}
              pinColor="#FF9A8A"
            />
          ))}
        </MapView>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.greeting}>Your Healing Journey</Text>
            <TouchableOpacity onPress={showDatePicker} style={styles.dateContainer}>
              <View style={styles.monthSection}>
                <Text style={styles.monthText}>
                  {format(selectedDate, "MMM", { locale: id })}
                </Text>
              </View>
              <View style={styles.dateSection}>
                <Text style={styles.dateText}>
                  {format(selectedDate, "dd")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Places</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("retakeQuestions")}
                style={styles.retakeButton}
              >
                <Text style={styles.retakeButtonText}>Retake Questions</Text>
              </TouchableOpacity>
            </View>
            {renderMap()}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Tasks</Text>
            </View>
            {renderTodoList()}
          </View>

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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food Video Recommendations</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FF9A8A" />
            ) : (
              <VideoRecommendations videos={foodVideos} />
            )}
          </View>
        </ScrollView>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {todoListVisible && (
          <TodoList
            todoList={todoList || []}
            visible={todoListVisible}
            onClose={() => setTodoListVisible(false)}
            date={formattedSelectedDate}
          />
        )}
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
    fontWeight: "bold",
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 8,
  },
  seeAll: {
    textAlign: "right",
    color: "#FF9A8A",
    marginTop: 4,
  },
  todoItem: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 8,
  },
  todoLeftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    color: "#333333",
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
  seeAllText: {
    color: '#FF8080',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default HomePage;