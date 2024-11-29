import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsSignedIn, useIsSignedOut } from "../context/AuthContext";
import Login from "../screens/Login";
import Register from "../screens/Register";
import BottomTab from "./BottomTab";

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerStyle: {
      backgroundColor: "white",
    },
    headerTintColor: "#4267B2",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  },
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Home: {
          screen: BottomTab,
          options: {
            title: "Karsaku",
          },
        },
      },
    },
    SIgnedOut: {
      if: useIsSignedOut,
      screens: {
        Login: {
          screen: Login,
          options: {
            headerShown: false,
          },
        },
        Register: {
          screen: Register,
          options: {
            headerShown: false,
          },
        },
      },
    },
  },
});

export default RootStack;
