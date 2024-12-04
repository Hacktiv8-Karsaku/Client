import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";
import DetailDestination from "../components/DetailDestination";

const Destination = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Request location permission
    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied.");
        setLoading(false);
        return;
      }

      // Start watching the user's location with distance interval of 100 meters
      const locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 100 }, // Update location every 100 meters
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );

      return locationSubscription;
    };

    getLocationPermission();

    // Cleanup function to stop watching location when the component unmounts
    
  }, []);

  useEffect(() => {
    // Fetch places when the location changes
    if (location) {
      const fetchPlacesAround = async () => {
        setLoading(true);
        try {
          const { latitude, longitude } = location;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=tourist_attraction&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();

          if (data.results) {
            // Map the API response to fit the DetailDestination component
            const formattedPlaces = data.results.map((place) => ({
              id: place.place_id,
              name: place.name,
              rating: place.rating || "Not available",
              description: place.vicinity || "No description available",
              placeId: place.place_id, // To fetch details and photos
            }));
            setPlaces(formattedPlaces);
          } else {
            setError("No places found.");
          }
        } catch (err) {
          setError("Failed to fetch places.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchPlacesAround();
    }
  }, [location]); // Refetch when the location changes

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading destinations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Destinations Nearby</Text>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DetailDestination place={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default Destination;
