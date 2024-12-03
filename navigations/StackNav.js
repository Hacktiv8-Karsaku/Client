import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Questions from "../screens/Questions";
import BottomTab from "./BottomTab";
import Profile from "../screens/Profile";
import ProfessionalScreen from "../screens/ProfessionalScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfessionalDashboard from "../screens/ProfessionalDashboard";
import LoginProfessional from "../screens/LoginProfessional";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfessionalChat from "../screens/ProfessionalChat";
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isSignedIn } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);

  // Check role when component mounts
  useEffect(() => {
    const checkRole = async () => {
      const role = await SecureStore.getItemAsync('role');
      setUserRole(role);
    };
    checkRole();
  }, [isSignedIn]);

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
          // Authenticated Stack
          userRole === 'professional' ? (
            // Professional Routes
            <>
              <Stack.Screen
                name="ProfessionalDashboard"
                component={ProfessionalDashboard}
                options={{ title: "Dashboard" }}
              />
              <Stack.Screen
                name="ProfessionalChat"
                component={ProfessionalChat}
                options={{ title: "Chats" }}
              />
            </>
          ) : (
            // User Routes
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
                name="Questions"
                component={Questions}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ title: "Profile" }}
              />
              <Stack.Screen
                name="ProfessionalScreen"
                component={ProfessionalScreen}
                options={{ title: "Professional" }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ title: "Chat" }}
              />
            </>
          )
        ) : (
          // Auth Routes
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginProfessional"
              component={LoginProfessional}
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
