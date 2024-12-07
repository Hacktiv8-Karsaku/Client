import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from "@env";

const DetailDestination = ({ place, isPreview }) => {
  const photoUrl = place.placeId
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&place_id=${place.placeId}&key=${GOOGLE_MAPS_API_KEY}`
    : null;

  const openInGoogleMaps = () => {
    const { coordinates, name, placeId } = place;
    const label = encodeURIComponent(name);
    const primaryUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}&query_place_id=${placeId}`;
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

  return (
    <TouchableOpacity style={styles.container} onPress={openInGoogleMaps}>
      {photoUrl && (
        <Image 
          source={{ uri: photoUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.description}>{place.description}</Text>
        {place.rating && (
          <Text style={styles.rating}>Rating: {place.rating} ⭐</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#FF9A8A',
  },
});

export default DetailDestination;
