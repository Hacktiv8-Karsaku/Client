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
  ActivityIndicator,
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
      dailyActivities
      stressLevel
      preferredFoods
      avoidedFoods
      domicile
      recommendations {
        todoList
        places {
          name
          description
          address
          coordinates {
            lat
            lng
          }
          placeId
        }
        foodVideos {
          title
          url
          thumbnail
          description
        }
      }
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
  const [isLoading, setIsLoading] = useState(false);

  const [updatePreferences] = useMutation(UPDATE_USER_PREFERENCES);

  const handleSubmit = async () => {
    if (!activities || !domicile) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await updatePreferences({
        variables: {
          job: route?.params?.job || "",
          dailyActivities: activities.split(",").map((item) => item.trim()).filter(Boolean),
          stressLevel: parseInt(stressLevel),
          preferredFoods: preferredFoods.split(",").map((item) => item.trim()).filter(Boolean),
          avoidedFoods: avoidedFoods.split(",").map((item) => item.trim()).filter(Boolean),
          domicile: domicile.trim(),
          date: date,
        },
        refetchQueries: [
          {
            query: GET_RECOMMENDATIONS,
            variables: { date }
          }
        ],
      });

      await SecureStore.setItemAsync("questions_completed", "true");
      setShouldAskQuestions(false);

      if (route?.params?.onRetakeComplete) {
        route.params.onRetakeComplete();
        navigation.goBack();
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to update preferences. Please try again."
      );
    } finally {
      setIsLoading(false);
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

        <Animatable.View animation="fadeInUp" style={styles.card}>
          {renderInputField(
            "What activities do you want to do?",
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
            "Where do you want to go?",
            domicile,
            setDomicile,
            "e.g., Jakarta, Indonesia",
            "map-pin"
          )}

          <Animatable.View animation="fadeInUp" delay={600}>
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#FF9A8A", "#FF8080"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Start My Journey</Text>
                    <Feather name="arrow-right" size={20} color="#FFF" />
                  </>
                )}
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
    backgroundColor: '#f5f5f5',
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
    marginRight: 8,
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  header: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  headerGradient: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: -50,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  todoCard: {
    backgroundColor: 'white',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.84,
    elevation: 3,
  },
  datePicker: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
  },
});
