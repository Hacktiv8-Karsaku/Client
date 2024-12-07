import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Linking, TouchableOpacity, Image } from "react-native";
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

  const initialMapRegion = React.useMemo(() => {
    if (!nearbyPlaces.length) return null;

    const allCoordinates = nearbyPlaces.map(place => ({
      latitude: place.coordinates?.lat || parseFloat(place.latitude),
      longitude: place.coordinates?.lng || parseFloat(place.longitude),
    }));

    if (preferredLocation) {
      allCoordinates.push(preferredLocation);
    }

    if (allCoordinates.length === 0) return null;

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
  }, [nearbyPlaces, preferredLocation]);

  const fetchNearbyPlaces = async (latitude, longitude) => {
    try {
      const placeTypes = ['tourist_attraction', 'park', 'spa', 'cafe', 'restaurant'];
      const keywords = ['healing', 'wellness', 'relaxation', 'meditation'];
      
      const allPlaces = [];
      
      for (const type of placeTypes) {
        for (const keyword of keywords) {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
            `location=${latitude},${longitude}&radius=10000&type=${type}` +
            `&keyword=${keyword}&key=${GOOGLE_MAPS_API_KEY}`
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
              type: place.types[0],
              photos: place.photos
            }));
            allPlaces.push(...places);
          }
        }
      }

      const uniquePlaces = Array.from(
        new Map(allPlaces.map(place => [place.placeId, place])).values()
      );

      setNearbyPlaces(uniquePlaces);
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

  const openInGoogleMaps = (place) => {
    const { coordinates, name } = place;
    const label = encodeURIComponent(name);
    const primaryUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}&query_place_id=${place.placeId}`;
    const fallbackUrl = `https://www.google.com/maps/search/${label}/@${coordinates.lat},${coordinates.lng},15z`;

    Linking.canOpenURL(primaryUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(primaryUrl);
        }
        return Linking.openURL(fallbackUrl);
      })
      .catch((err) => {
        console.error('Error opening Google Maps:', err);
        Linking.openURL(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`);
      });
  };

  const renderPlaceItem = ({ item }) => {
    const photoReference = item.photos?.[0]?.photo_reference;
    const photoUrl = photoReference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`
      : null;

    return (
      <TouchableOpacity 
        style={styles.placeItem} 
        onPress={() => openInGoogleMaps(item)}
      >
        {photoUrl && (
          <Image 
            source={{ uri: photoUrl }} 
            style={styles.placeImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{item.name}</Text>
          <Text style={styles.placeDescription}>{item.description}</Text>
          {item.rating && (
            <Text style={styles.placeRating}>Rating: {item.rating} ⭐</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMap = () => {
    if (!mapRegion) return <ActivityIndicator size="large" color="#FF9A8A" />;

    return (
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={mapRegion}
          initialRegion={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          followsUserLocation={true}
          userLocationAnnotationTitle="You are here"
          userLocationCalloutEnabled={true}
        >
          {nearbyPlaces.map((place, index) => (
            <Marker
              key={`${place.placeId}-${index}`}
              coordinate={{
                latitude: place.coordinates?.lat || parseFloat(place.latitude),
                longitude: place.coordinates?.lng || parseFloat(place.longitude),
              }}
              title={place.name}
              description={place.description}
              pinColor="#FF9A8A"
              onCalloutPress={() => openInGoogleMaps(place)}
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
        renderItem={renderPlaceItem}
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
    height: 300,
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
  },
  placeItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  placeImage: {
    width: '100%',
    height: 200,
  },
  placeInfo: {
    padding: 16,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  placeRating: {
    fontSize: 14,
    color: '#FF9A8A',
  },
});

export default Destination;
