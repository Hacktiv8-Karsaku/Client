import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";

const MapDisplay = ({ places }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        // Convert place names to coordinates using Google Geocoding API
        if (places && places.length > 0) {
          const markersData = await Promise.all(
            places.map(async (place) => {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                  place.name
                )}&key=${GOOGLE_MAPS_API_KEY}`
              );
              const data = await response.json();

              if (data.results && data.results[0]) {
                const { lat, lng } = data.results[0].geometry.location;
                return {
                  coordinate: {
                    latitude: lat,
                    longitude: lng,
                  },
                  title: place.name,
                  description: place.description,
                };
              }
              return null;
            })
          );

          setMarkers(markersData.filter((marker) => marker !== null));
        }

        setLoading(false);
      } catch (error) {
        setErrorMsg("Error getting location");
        console.error(error);
      }
    })();
  }, [places]);

  if (errorMsg) {
    return <Text style={{ textAlign: "center" }}>{errorMsg}</Text>;
  }

  if (!location) {
    return <ActivityIndicator size="large" color="#FF9A8A" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: 300,
  },
});

export default MapDisplay;
