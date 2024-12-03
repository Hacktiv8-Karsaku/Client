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

const LOGIN_PROFESSIONAL = gql`
  mutation LoginProfessional($email: String!, $password: String!) {
    loginProfessional(email: $email, password: $password) {
      access_token
      professionalId
      name
    }
  }
`;

export default function LoginProfessional() {
  const [loginProfessional, { loading }] = useMutation(LOGIN_PROFESSIONAL);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const result = await loginProfessional({
        variables: {
          email: email,
          password: password,
        },
      });
      
      await Promise.all([
        SecureStore.setItemAsync(
          "access_token",
          result.data.loginProfessional.access_token
        ),
        SecureStore.setItemAsync(
          "professional_id", 
          result.data.loginProfessional.professionalId
        ),
        SecureStore.setItemAsync(
          "role",
          "professional"
        )
      ]);
      
      setIsSignedIn(true);
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'ProfessionalDashboard' }],
        });
      }, 100);
    } catch (error) {
      console.log(error);
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Professional Login</Text>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
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
  }
});
