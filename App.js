import { createStaticNavigation } from "@react-navigation/native";
import RootStack from "./navigations/StackNav";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import { AuthContext } from "./context/AuthContext";
import { useEffect, useState } from "react";

const Navigation = createStaticNavigation(RootStack);
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    async function checkToken() {
      const token = await SecureStore.getItemAsync("access_token");
      if (token) {
        setIsSignedIn(true);
      }
      setLoading(false);
    }
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
        <Navigation />
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
