import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { Feather } from "@expo/vector-icons";

const REGISTER = gql`
  mutation Mutation(
    $name: String
    $username: String
    $email: String
    $password: String
    $job: String
  ) {
    createUser(
      name: $name
      username: $username
      email: $email
      password: $password
      job: $job
    ) {
      _id
      name
      username
      email
      password
      job
    }
  }
`;

export default function Register() {
  const [register, { isLoading }] = useMutation(REGISTER);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      setLoading(true);
      const result = await register({
        variables: {
          name,
          username,
          email,
          password,
          job,
        },
      });
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
      Keyboard.dismiss();
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
            <Text style={styles.headerText}>Create Account</Text>
            <Text style={styles.subHeaderText}>Sign up to get started</Text>
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
                  placeholder="Full Name"
                  onChangeText={setName}
                  value={name}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Feather name="at-sign" size={20} color="#FF9A8A" />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  onChangeText={setUsername}
                  value={username}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="#FF9A8A" />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
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

              <View style={styles.inputWrapper}>
                <Feather name="briefcase" size={20} color="#FF9A8A" />
                <TextInput
                  style={styles.input}
                  placeholder="Job"
                  onChangeText={setJob}
                  value={job}
                  placeholderTextColor="#999"
                />
              </View>

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#FF9A8A"
                  style={styles.loader}
                />
              ) : (
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRegister}
                >
                  <Text style={styles.registerButtonText}>SIGN UP</Text>
                </TouchableOpacity>
              )}

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Sign In</Text>
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
    flex: 3,
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
  registerButton: {
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
  registerButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  loader: {
    marginVertical: 20,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#FF9A8A",
    fontSize: 14,
    fontWeight: "bold",
  },
});
