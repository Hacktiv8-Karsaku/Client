import React from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import * as Animatable from "react-native-animatable";
const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="pulse"
        iterationCount="infinite"
        source={require("../assets/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 400,
    height: 400,
  },
});
export default SplashScreen;
