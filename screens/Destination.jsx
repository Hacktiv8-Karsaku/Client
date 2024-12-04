import React from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import DetailDestination from "../components/DetailDestination";
import { useQuery } from "@apollo/client";
import { GET_RECOMMENDATIONS } from "../graphql/queries";

const Destination = () => {
  const { loading, error, data } = useQuery(GET_RECOMMENDATIONS);
  const places = data?.getUserProfile?.recommendations?.places || [];

  if (loading) {
    return <ActivityIndicator size="large" color="#FF9A8A" />;
  }

  if (error) {
    return <Text>Error loading destinations</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Destinations</Text>
      <FlatList
        data={places}
        keyExtractor={(item, index) => index.toString()}
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
