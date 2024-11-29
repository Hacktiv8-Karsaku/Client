import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Ionicons from "@expo/vector-icons/Ionicons";

const BottomTab = createBottomTabNavigator({
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === "Home") {
        iconName = focused ? "home" : "home-outline";
      } else if (route.name === "Profile") {
        iconName = focused ? "menu" : "menu-outline";
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
    Profile: {
      screen: Profile,
      options: {
        headerShown: false,
      },
    },
  },
});

export default BottomTab;
