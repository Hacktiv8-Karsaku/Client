import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const Destination = () => {
  const dummyData = [
    { id: "1", name: "Beach Paradise", rating: 4.8 },
    { id: "2", name: "Mountain Retreat", rating: 4.6 },
    { id: "3", name: "Forest Adventure", rating: 4.7 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Destinations</Text>
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.rating}>Rating: {item.rating}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  card: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  rating: {
    fontSize: 14,
    color: "#777777",
  },
});

export default Destination;
