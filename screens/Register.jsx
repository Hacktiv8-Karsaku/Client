import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const REGISTER = gql`
  mutation Mutation(
    $name: String
    $username: String
    $email: String
    $password: String
    $location: String
  ) {
    createUser(
      name: $name
      username: $username
      email: $email
      password: $password
      location: $location
    ) {
      _id
      name
      username
      email
      password
      location
    }
  }
`;

export default function Register() {
  const [register, { loading }] = useMutation(REGISTER);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const result = await register({
        variables: {
          name: name,
          username: username,
          email: email,
          password: password,
          location: location
        },
      });
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Registration Error", error.message);
    } finally {
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        onChangeText={setName}
        value={name}
        placeholder="Full Name"
        style={styles.input}
      />
      <TextInput
        onChangeText={setUsername}
        value={username}
        placeholder="Username"
        style={styles.input}
      />
      <TextInput
        onChangeText={setLocation}
        value={location}
        placeholder="Location"
        style={styles.input}
      />
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        style={styles.input}
        secureTextEntry={true}
      />

      {!loading ? (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      ) : (
        <ActivityIndicator size="large" color="#ff9a8a" />
      )}

      <Text style={styles.loginPrompt}>
        Already have account?{" "}
        <Text
          style={styles.LoginLink}
          onPress={() => navigation.navigate("Login")}
        >
          Login here
        </Text>
      </Text>
    </View>
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
  picker: {
    width: "80%",
    height: 50,
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
  loginPrompt: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
  LoginLink: {
    color: "#FF9A8A",
    fontWeight: "bold",
  },
});
