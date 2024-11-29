import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Ionicons from "@expo/vector-icons/Ionicons";

const BottomTab = createBottomTabNavigator({
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === "Home") {
        iconName = focused ? "home" : "home-outline";
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarLabel: () => null,
    tabBarActiveTintColor: "#4267B2",
    tabBarInactiveTintColor: "#4267B2",
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  }),
  screens: {
    Home: {
      screen: Home,
      options: {
        headerShown: false,
      },
    },
  },
});

export default BottomTab;
