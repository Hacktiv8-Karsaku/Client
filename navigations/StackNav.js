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
import ProfessionalChat from "../screens/ProfessionalChat";
import UserChatHistory from "../screens/userChatHistory";
import * as SecureStore from 'expo-secure-store';
import { useContext, useState, useEffect } from "react";
import Destination from "../screens/Destination";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isSignedIn, userRole, shouldAskQuestions } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#FF9A8A',
          headerTitleStyle: {
            fontWeight: 'bold',
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
            {shouldAskQuestions ? (
              <Stack.Screen
                name="Questions"
                component={Questions}
                options={{
                  headerShown: false,
                }}
              />
            ) : (
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
                name="ProfessionalScreen"
                component={ProfessionalScreen}
                options={{ title: "Professional" }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ title: "Chat" }}
              />
              <Stack.Screen
                name="UserChatHistory"
                component={UserChatHistory}
                options={{
                  title: 'Chat History',
                  headerTitleAlign: 'center',
                }}
              />
            </>
          )
            )}
            <Stack.Screen
              name="Destination"
              component={Destination}
              options={{ title: "Recommended Destinations" }}
            />
          </>
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
