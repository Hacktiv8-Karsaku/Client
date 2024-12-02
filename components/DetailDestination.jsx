import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const DetailDestination = ({ name, imageUrl, rating, description }) => {
    return (
        <View style={styles.card}>
            {/* Gambar destinasi */}
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.content}>
                {/* Nama lokasi */}
                <Text style={styles.name}>{name}</Text>
                {/* Rating */}
                <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{rating}</Text>
                </View>
                {/* Deskripsi */}
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 16,
    },
    image: {
        width: "100%",
        height: 200,
    },
    content: {
        padding: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333333",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 16,
        color: "#333333",
    },
    description: {
        fontSize: 14,
        color: "#666666",
    },
});

export default DetailDestination;
