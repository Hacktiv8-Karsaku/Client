import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const DetailDestination = ({ place, isPreview }) => {
  const { 
    name, 
    rating, 
    description, 
    photos,
    vicinity,
    types,
    opening_hours 
  } = place;

  // Mengambil foto dari Google Places API
  const photoUrl = photos?.[0]?.photo_reference 
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    : "https://via.placeholder.com/400";

  return (
    <View style={[styles.container, isPreview && styles.preview]}>
      <ImageBackground
        source={{ uri: photoUrl }}
        style={[styles.background, isPreview && styles.previewBackground]}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.6)", "transparent"]}
          start={[0, 1]}
          end={[0, 0]}
          style={styles.gradient}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.rating}>⭐ {rating?.toFixed(1) || "N/A"}</Text>
          {!isPreview && (
            <>
              <Text style={styles.description}>{vicinity}</Text>
              <Text style={styles.type}>{types?.[0]?.replace(/_/g, ' ')}</Text>
              <Text style={styles.status}>
                {opening_hours?.open_now ? "Open Now" : "Closed"}
              </Text>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    height: 250,
  },
  preview: {
    width: 250,
    height: 150,
    marginHorizontal: 8,
  },
  background: {
    height: 250,
    width: '100%',
    justifyContent: "flex-end",
  },
  previewBackground: {
    height: 150,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  rating: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  description: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  type: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  status: {
    fontSize: 12,
    color: "#FFFFFF",
  },
});

export default DetailDestination;
