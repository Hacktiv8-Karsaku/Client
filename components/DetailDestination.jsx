import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { GOOGLE_MAPS_API_KEY } from "@env";

const DetailDestination = ({ place, isPreview = false }) => {
  const navigation = useNavigation();
  const [placeImage, setPlaceImage] = useState(null);

  useEffect(() => {
    const fetchPlacePhoto = async () => {
      if (!place.placeId) return;

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.placeId}&fields=photos,rating&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.result?.photos && data.result.photos.length > 0) {
          const photoReference = data.result.photos[0].photo_reference;
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${
            isPreview ? 400 : 800
          }&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;

          setPlaceImage(photoUrl);
        }
      } catch (error) {
        console.error("Error fetching place photo:", error);
      }
    };

    fetchPlacePhoto();
  }, [place.placeId, isPreview]);

  const handlePress = () => {
    if (!isPreview) {
      navigation.navigate("PlaceDetail", { place });
    }
  };

  if (!place || !place.name) {
    return null;
  }

  const fallbackImage =
    "https://i.pinimg.com/236x/39/89/de/3989dedb6cfedb5f7adab991d1750ab0.jpg";

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        isPreview ? styles.previewContainer : styles.fullContainer,
      ]}
    >
      <ImageBackground
        source={{ uri: placeImage || fallbackImage }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {place.name}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {place.address}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {place.rating}</Text>
            </View>
            {!isPreview && place.description && (
              <Text style={styles.description} numberOfLines={3}>
                {place.description}
              </Text>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  previewContainer: {
    width: 300,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  fullContainer: {
    width: "100%",
    marginVertical: 8,
  },
  background: {
    width: "100%",
    height: 200,
  },
  backgroundImage: {
    borderRadius: 15,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    color: "#fff",
    marginTop: 8,
    fontSize: 14,
    opacity: 0.9,
  },
});

export default DetailDestination;
