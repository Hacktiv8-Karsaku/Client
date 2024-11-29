import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { View, Text, Button } from "react-native";

export default function Profile() {
  const { setIsSignedIn } = useContext(AuthContext);
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsSignedIn(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
        Ini Profile
      </Text>
      <Button
        title="logout"
        onPress={() => {
          handleLogout();
        }}
      />
    </View>
  );
}