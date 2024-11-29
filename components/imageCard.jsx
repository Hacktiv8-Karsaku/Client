import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ImageCard = ({ imageUrl, title }) => {
  return (
    <View style={styles.imageCard}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      {title && <Text style={styles.imageTitle}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  imageCard: {
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageTitle: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ImageCard;
