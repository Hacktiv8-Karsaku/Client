import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const StressLv = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Stress Level (1-10)</Text>
      <Text style={styles.value}>{value}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#FF9A8A"
        maximumTrackTintColor="#FF9A8A"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    color: "#FF9A8A",
    textAlign: "center",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

export default StressLv;
