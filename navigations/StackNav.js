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
import VideoCallScreen from "../screens/VideoCallScreen";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isSignedIn } = useContext(AuthContext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const getRole = async () => {
      try {
        const userRole = await SecureStore.getItemAsync('role');
        console.log('User role from SecureStore:', userRole);
        setRole(userRole);
      } catch (error) {
        console.error('Error getting role from SecureStore:', error);
      }
    };

    if (isSignedIn) {
      getRole();
    }
  }, [isSignedIn]);

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
          role === 'professional' ? (
            // Professional Routes
            <>
              <Stack.Screen
                name="ProfessionalDashboard"
                component={ProfessionalDashboard}
                options={{ 
                  title: "Professional Dashboard",
                  headerLeft: null,
                }}
              />
              <Stack.Screen
                name="ProfessionalChat"
                component={ProfessionalChat}
                options={{ title: "Chat" }}
              />
              <Stack.Screen
                name="VideoCall"
                component={VideoCallScreen}
                options={{ 
                  headerShown: false,
                  presentation: 'fullScreenModal'
                }}
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
              <Stack.Screen
                name="UserChatHistory"
                component={UserChatHistory}
                options={{
                  title: 'Chat History',
                  headerTitleAlign: 'center',
                }}
              />
              <Stack.Screen
                name="VideoCall"
                component={VideoCallScreen}
                options={{ 
                  headerShown: false,
                  presentation: 'fullScreenModal'
                }}
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
