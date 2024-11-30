import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences(
    $job: String
    $dailyActivities: [String]
    $stressLevel: Int
    $preferredFoods: [String]
    $avoidedFoods: [String]
  ) {
    updateUserPreferences(
      job: $job
      dailyActivities: $dailyActivities
      stressLevel: $stressLevel
      preferredFoods: $preferredFoods
      avoidedFoods: $avoidedFoods
    ) {
      _id
      job
      stressLevel
    }
  }
`;

export default function Questions() {
  const navigation = useNavigation();
  const [job, setJob] = useState("");
  const [activities, setActivities] = useState("");
  const [stressLevel, setStressLevel] = useState(1);
  const [preferredFoods, setPreferredFoods] = useState("");
  const [avoidedFoods, setAvoidedFoods] = useState("");

  const [updatePreferences] = useMutation(UPDATE_USER_PREFERENCES);

  const handleSubmit = async () => {
    try {
      await updatePreferences({
        variables: {
          job,
          dailyActivities: activities.split(",").map((item) => item.trim()),
          stressLevel: parseInt(stressLevel),
          preferredFoods: preferredFoods.split(",").map((item) => item.trim()),
          avoidedFoods: avoidedFoods.split(",").map((item) => item.trim()),
        },
      });
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help us personalize your experience</Text>

      <Text style={styles.label}>What's your job?</Text>
      <TextInput
        style={styles.input}
        value={job}
        onChangeText={setJob}
        placeholder="Enter your job"
      />

      <Text style={styles.label}>What activities did you do today?</Text>
      <TextInput
        style={styles.input}
        value={activities}
        onChangeText={setActivities}
        placeholder="Separate activities with commas"
        multiline
      />

      <Text style={styles.label}>Stress Level (1-10)</Text>
      <Picker
        selectedValue={stressLevel}
        onValueChange={(value) => setStressLevel(value)}
        style={styles.picker}
      >
        {[...Array(10)].map((_, i) => (
          <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
        ))}
      </Picker>

      <Text style={styles.label}>Preferred Foods</Text>
      <TextInput
        style={styles.input}
        value={preferredFoods}
        onChangeText={setPreferredFoods}
        placeholder="Separate foods with commas"
      />

      <Text style={styles.label}>Foods to Avoid</Text>
      <TextInput
        style={styles.input}
        value={avoidedFoods}
        onChangeText={setAvoidedFoods}
        placeholder="Separate foods with commas"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF5F3",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FF9A8A",
    textAlign: "center",
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FF9A8A",
  },
  picker: {
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FF9A8A",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
