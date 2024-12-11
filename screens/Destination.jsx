import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";
import DetailDestination from "../components/DetailDestination";

const Destination = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  let locationSubscription = null;

  useEffect(() => {
    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied.");
        setLoading(false);
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 100 },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    };

    getLocationPermission();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (location) {
      const fetchPlacesAround = async () => {
        setLoading(true);
        try {
          const { latitude, longitude } = location;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=tourist_attraction&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();

          if (data.results) {
            const formattedPlaces = data.results
              .filter(
                (place) =>
                  place.rating !== undefined &&
                  place.rating >= 4.5 &&
                  place.user_ratings_total >= 20 &&
                  place.photos &&
                  place.photos.length > 0 &&
                  place.business_status === "OPERATIONAL" &&
                  place.name &&
                  (place.vicinity || place.formatted_address)
              )
              .map((place) => ({
                id: place.place_id,
                name: place.name,
                rating: place.rating,
                address: place.vicinity || place.formatted_address,
                placeId: place.place_id,
                totalRatings: place.user_ratings_total,
                hasPhotos: place.photos ? true : false,
              }));

            if (formattedPlaces.length > 0) {
              setPlaces(formattedPlaces);
            } else {
              setError(
                "No popular tourist destinations (4.5+ stars with sufficient reviews) found in this area."
              );
            }
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
  }, [location]);

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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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
