import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import DetailDestination from "../components/DetailDestination";

const Destination = () => {
  const dummyData = [
    {
      id: "1",
      name: "Beach Paradise",
      rating: 4.8,
      description: "A beautiful beach with clear blue water.",
      image: "https://vietnam.travel/sites/default/files/inline-images/shutterstock_585187837.jpg",
    },
    {
      id: "2",
      name: "Mountain Retreat",
      rating: 4.6,
      description: "A peaceful retreat in the mountains.",
      image: "https://cdn.britannica.com/72/11472-050-B9734C89/Bear-Hat-Mountain-Hidden-Lake-Montana-Glacier.jpg",
    },
    {
      id: "3",
      name: "Forest Adventure",
      rating: 4.7,
      description: "An exciting adventure in the forest.",
      image: "https://resilience-blog.com/wp-content/uploads/2022/06/cover-HD-scaled.jpg",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Destinations</Text>
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DetailDestination place={item} />}
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default Destination;
