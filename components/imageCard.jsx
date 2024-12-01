import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ImageCard = ({ imageUrl, title, description, style }) => {
  return (
    <TouchableOpacity style={[styles.card, style]}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 4,
  },
});

export default ImageCard;
