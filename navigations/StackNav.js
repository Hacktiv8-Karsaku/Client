import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Questions from "../screens/Questions";
import BottomTab from "./BottomTab";
import Profile from "../screens/Profile";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isSignedIn, shouldAskQuestions } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "#4267B2",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {isSignedIn ? (
          shouldAskQuestions ? (
            <Stack.Screen
              name="Questions"
              component={Questions}
              options={{ 
                headerShown: false,
                gestureEnabled: false 
              }}
            />
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={BottomTab}
                options={{
                  title: "Karsaku",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ title: "Profile" }}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
