import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Questions from "../screens/Questions";
import BottomTab from "./BottomTab";
import Profile from "../screens/Profile";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import VideoCall from "../screens/videoCall";
import WaitingRoom from "../screens/waitingRoom";
import DoctorSelection from "../screens/DoctorSelection";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isSignedIn } = useContext(AuthContext);

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
          <>
            <Stack.Screen
              name="Questions"
              component={Questions}
              options={{ headerShown: false }}
            />
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
            <Stack.Screen 
              name="DoctorSelection" 
              component={DoctorSelection}
              options={{
                title: 'Select Doctor',
                headerShown: true
              }}
            />
            <Stack.Screen
              name="WaitingRoom"
              component={WaitingRoom}
              options={{ 
                title: "Waiting Room",
                headerShown: true 
              }}
            />
            <Stack.Screen
              name="VideoCall"
              component={VideoCall}
              options={{ headerShown: false }}
            />
          </>
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
