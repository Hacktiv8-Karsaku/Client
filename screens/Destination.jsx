import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import DetailDestination from "../components/DetailDestination";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../graphql/queries";
import Geocoding from 'react-native-geocoding';
import { GOOGLE_MAPS_API_KEY } from "@env";

const Destination = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [preferredLocation, setPreferredLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const { data: userData, loading: queryLoading } = useQuery(GET_USER_PROFILE);
  const domicile = userData?.getUserProfile?.domicile;

  const fetchNearbyPlaces = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=tourist_attraction&keyword=healing&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results) {
        const places = data.results.map(place => ({
          placeId: place.place_id,
          name: place.name,
          description: place.vicinity,
          rating: place.rating?.toString() || "4.0",
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          type: place.types[0]
        }));

        setNearbyPlaces(places);
      }
    } catch (err) {
      console.error('Error fetching nearby places:', err);
      setError("Could not fetch nearby places");
    }
  };

  useEffect(() => {
    const getPreferredLocation = async () => {
      if (!domicile) {
        setError("No domicile location found in your profile");
        setLoading(false);
        return;
      }

      try {
        Geocoding.init(GOOGLE_MAPS_API_KEY);
        const response = await Geocoding.from(domicile);
        const { lat, lng } = response.results[0].geometry.location;

        const location = {
          latitude: lat,
          longitude: lng,
        };

        const region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setPreferredLocation(location);
        setMapRegion(region);
        await fetchNearbyPlaces(lat, lng);
      } catch (err) {
        console.error('Geocoding error:', err);
        setError("Could not find your domicile location.");
      } finally {
        setLoading(false);
      }
    };

    getPreferredLocation();
  }, [domicile]);

  const renderMap = () => {
    if (!mapRegion) return <ActivityIndicator size="large" color="#FF9A8A" />;

    return (
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={mapRegion}
          region={mapRegion}
          showsUserLocation={false}
        >
          {preferredLocation && (
            <Marker
              coordinate={preferredLocation}
              title="Your Location"
              description={domicile}
              pinColor="#4285F4"
            />
          )}

          {nearbyPlaces.map((place, index) => (
            <Marker
              key={place.placeId || index}
              coordinate={{
                latitude: place.coordinates.lat,
                longitude: place.coordinates.lng,
              }}
              title={place.name}
              description={place.description}
              pinColor="#FF9A8A"
              onPress={() => {
                console.log('Place pressed:', place.name);
              }}
            />
          ))}
        </MapView>
      </View>
    );
  };

  if (loading || queryLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF9A8A" />
        <Text>Loading destinations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderMap()}
      <Text style={styles.title}>Nearby Healing Places</Text>
      <FlatList
        data={nearbyPlaces}
        keyExtractor={(item) => item.placeId}
        renderItem={({ item }) => (
          <DetailDestination place={item} />
        )}
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
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
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
  }
});

export default Destination;
