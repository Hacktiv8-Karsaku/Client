import React, { useState, useContext } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  View,
  Animated,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import StressLv from "../components/StressLv";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { GET_RECOMMENDATIONS } from "../graphql/queries";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences(
    $job: String
    $dailyActivities: [String]
    $stressLevel: Int
    $preferredFoods: [String]
    $avoidedFoods: [String]
    $domicile: String
    $date: String
  ) {
    updateUserPreferences(
      job: $job
      dailyActivities: $dailyActivities
      stressLevel: $stressLevel
      preferredFoods: $preferredFoods
      avoidedFoods: $avoidedFoods
      domicile: $domicile
      date: $date
    ) {
      _id
      job
      stressLevel
      lastQuestionDate
    }
  }
`;

export default function Questions({ route }) {
  console.log(route.params, "<<<route.params");

  const { setShouldAskQuestions } = useContext(AuthContext);
  const navigation = useNavigation();

  const [activities, setActivities] = useState("");
  const [stressLevel, setStressLevel] = useState(5);
  const [preferredFoods, setPreferredFoods] = useState("");
  const [avoidedFoods, setAvoidedFoods] = useState("");
  const [domicile, setDomicile] = useState("");
  const [date] = useState(route?.params?.date || new Date().toISOString());

  const [updatePreferences] = useMutation(UPDATE_USER_PREFERENCES);

  const handleSubmit = async () => {
    try {
      const { data } = await updatePreferences({
        variables: {
          dailyActivities: activities.split(",").map((item) => item.trim()),
          stressLevel,
          preferredFoods: preferredFoods.split(",").map((item) => item.trim()),
          avoidedFoods: avoidedFoods.split(",").map((item) => item.trim()),
          domicile: domicile.trim(),
          date,
        },
        refetchQueries: [{ query: GET_RECOMMENDATIONS }],
      });

      await SecureStore.setItemAsync("questions_completed", "true");
      setShouldAskQuestions(false);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderInputField = (label, value, setValue, placeholder, icon) => (
    <Animatable.View
      animation="fadeInUp"
      delay={300}
      style={styles.inputContainer}
    >
      <Text style={styles.label}>
        <Feather name={icon} size={18} color="#FF9A8A" /> {label}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        multiline={label.includes("activities")}
        placeholderTextColor="#999"
      />
    </Animatable.View>
  );

  return (
    <LinearGradient colors={["#FFF5F3", "#FFE5E5"]} style={styles.gradient}>
      <ScrollView style={styles.container}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Let's Personalize Your Journey
        </Animatable.Text>
        <Text>Questions For Date:{route?.params?.date}</Text>

        <Animatable.View animation="fadeInUp" style={styles.card}>
          {renderInputField(
            "What activities did you do today?",
            activities,
            setActivities,
            "e.g., working, reading, exercise",
            "activity"
          )}

          <StressLv value={stressLevel} onChange={setStressLevel} />

          {renderInputField(
            "What foods do you enjoy?",
            preferredFoods,
            setPreferredFoods,
            "e.g., sushi, salad, pasta",
            "coffee"
          )}

          {renderInputField(
            "Any foods to avoid?",
            avoidedFoods,
            setAvoidedFoods,
            "e.g., spicy, dairy, nuts",
            "alert-circle"
          )}

          {renderInputField(
            "Where do you live?",
            domicile,
            setDomicile,
            "e.g., Jakarta, Indonesia",
            "map-pin"
          )}

          <Animatable.View animation="fadeInUp" delay={600}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <LinearGradient
                colors={["#FF9A8A", "#FF8080"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Start My Journey</Text>
                <Feather name="arrow-right" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#FF9A8A",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
    fontWeight: "500",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD6D6",
    fontSize: 16,
    color: "#333",
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderRadius: 12,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
});
