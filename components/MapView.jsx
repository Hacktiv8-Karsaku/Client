import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

const MapDisplay = ({ places }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
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
        setLoading(false);
      } catch (error) {
        setErrorMsg("Error getting location");
        console.error(error);
      }
    })();
  }, []);

  if (errorMsg) {
    return <Text style={{ textAlign: "center" }}>{errorMsg}</Text>;
  }

  if (loading || !location) {
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
        {/* Current Location Marker */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          pinColor="#FF9A8A"
        >
          <Callout>
            <Text>Your Location</Text>
          </Callout>
        </Marker>

        {/* Place Markers */}
        {places?.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.coordinates?.lat || 0,
              longitude: place.coordinates?.lng || 0,
            }}
            title={place.name}
            description={place.description}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{place.name}</Text>
                <Text style={styles.calloutDescription}>{place.description}</Text>
                <Text style={styles.calloutAddress}>{place.address}</Text>
              </View>
            </Callout>
          </Marker>
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
    height: 500,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  calloutAddress: {
    fontSize: 12,
    color: "#666",
  },
});

export default MapDisplay;
