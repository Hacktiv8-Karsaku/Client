import RootStack from "./navigations/StackNav";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import { AuthContext } from "./context/AuthContext";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import CustomSplashScreen from './components/SplashScreen';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [shouldAskQuestions, setShouldAskQuestions] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make API calls, etc.
        await checkToken();
        
        // Artificial delay for a smoother splash screen
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setShowSplash(false);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  async function checkToken() {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      const questionStatus = await SecureStore.getItemAsync("questions_completed");
      
      if (token) {
        setIsSignedIn(true);
        setShouldAskQuestions(questionStatus !== "true");
      } else {
        setIsSignedIn(false);
        setShouldAskQuestions(true);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setIsSignedIn(false);
      setShouldAskQuestions(true);
    } finally {
      setLoading(false);
    }
  }

  if (showSplash) {
    return <CustomSplashScreen />;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider 
        value={{ 
          isSignedIn, 
          setIsSignedIn, 
          shouldAskQuestions, 
          setShouldAskQuestions 
        }}
      >
        <RootStack />
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
