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
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { Feather } from "@expo/vector-icons";

const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      access_token
      userId
      username
      shouldAskQuestions
    }
  }
`;

export default function Login() {
  const [login, { loading }] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const { setIsSignedIn, setShouldAskQuestions } = useContext(AuthContext);
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
      await SecureStore.setItemAsync(
        "questions_completed",
        result.data.login.shouldAskQuestions ? "false" : "true"
      );

      setShouldAskQuestions(result.data.login.shouldAskQuestions);
      setIsSignedIn(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#FF9A8A", "#FFF5F3"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animatable.View
            animation="fadeIn"
            duration={1500}
            style={styles.header}
          >
            <Text style={styles.headerText}>Welcome Back!</Text>
            <Text style={styles.subHeaderText}>Sign in to continue</Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUpBig"
            duration={1500}
            style={styles.footer}
          >
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={20} color="#FF9A8A" />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  onChangeText={setUsername}
                  value={username}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#FF9A8A" />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry={secureEntry}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
                  <Feather
                    name={secureEntry ? "eye-off" : "eye"}
                    size={20}
                    color="#FF9A8A"
                  />
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#FF9A8A"
                  style={styles.loader}
                />
              ) : (
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>
              )}

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  headerText: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subHeaderText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 10,
  },
  footer: {
    flex: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#FF9A8A",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#FF9A8A",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  loader: {
    marginVertical: 20,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#FF9A8A",
    fontSize: 14,
    fontWeight: "bold",
  },
});
