import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const DetailDestination = ({ place, isPreview }) => {
  const { name, rating, description, image } = place;

  return (
    <View style={[styles.container, isPreview && styles.preview]}>
      {/* Background Image */}
      <ImageBackground
        source={{ uri: image || "https://statik.tempo.co/data/2021/07/24/id_1037336/1037336_720.jpg" }}
        style={[styles.background, isPreview && styles.previewBackground]}
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.6)", "transparent"]}
          start={[0, 1]}
          end={[0, 0]}
          style={styles.gradient}
        />
        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.rating}>Rating: {rating || 0}/5</Text>
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
});

export default DetailDestination;
