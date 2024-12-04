import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GOOGLE_MAPS_API_KEY } from "@env";

const DetailDestination = ({ place, isPreview }) => {
  const { name, description, placeId } = place;
  // const placeId = "ChIJ-S4F5Bb0aS4RgVq6v81ZM4s"
  const [placeImage, setPlaceImage] = useState(null);

  useEffect(() => {
    const fetchPlacePhoto = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        console.log(data);
        
        // const rating = data.result?.rating;
        if (
          data.result?.photos &&
          data.result.photos.length > 0
        ) {
          const photoReference = data.result.photos[0].photo_reference;

          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${isPreview ? 150 : 250
            }&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;

          setPlaceImage(photoUrl);
        }
      } catch (error) {
        console.error("Error fetching place photo:", error);
      }
    };

    if (placeId) {
      fetchPlacePhoto();
    }
  }, [placeId, isPreview]);

  return (
    <View style={[styles.container, isPreview && styles.preview]}>
      <ImageBackground
        source={{
          uri:
            placeImage ||
            "https://statik.tempo.co/data/2021/07/24/id_1037336/1037336_720.jpg",
        }}
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
          <Text style={styles.rating}>Rating: 0/5</Text>
          {!isPreview && <Text style={styles.description}>{description}</Text>}
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
    width: "100%",
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
