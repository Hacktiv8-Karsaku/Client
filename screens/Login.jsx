import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../context/AuthContext";

const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      access_token
      userId
      username
    }
  }
`;

export default function Login() {
  const [login, { loading }] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const result = await login({
        variables: {
          username: username,
          password: password,
        },
      });
      await SecureStore.setItemAsync(
        "access_token",
        result.data.login.access_token
      );
      await SecureStore.setItemAsync("user_id", result.data.login.userId);
      setIsSignedIn(true);
      setTimeout(() => {
        navigation.replace("Questions");
      }, 100);
    } catch (error) {
      console.log(error);
      Alert.alert("Login Error", error.message);
    }
  };
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          style={styles.input}
        />
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          style={styles.input}
          secureTextEntry={true}
        />
        {!loading ? (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator size="large" color="#ff9a8a" />
        )}
        <Text style={styles.registerPrompt}>
          Don't have any account?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            Register here
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F3",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF9A8A",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF9A8A",
  },
  button: {
    marginTop: 20,
    width: "80%",
    backgroundColor: "#FF9A8A",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerPrompt: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
  registerLink: {
    color: "#FF9A8A",
    fontWeight: "bold",
  },
});
