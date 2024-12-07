import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import * as Calendar from "expo-calendar";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { GET_RECOMMENDATIONS, REGENERATE_TODOS } from "../graphql/queries";

const GET_SAVED_TODOS = gql`
  query GetSavedTodos($date: String) {
    getSavedTodos(date: $date) {
      todoItem
      date
      status
    }
  }
`;

const SAVE_TODO = gql`
  mutation SaveTodoItem($todoItem: String, $date: String) {
    saveTodoItem(todoItem: $todoItem, date: $date) {
      _id
    }
  }
`;

const TodoList = ({ todoList = [], visible, onClose, date }) => {
  const { data: savedTodosData, refetch } = useQuery(GET_SAVED_TODOS, {
    variables: { date },
  });
  
  const { data: recommendationsData } = useQuery(GET_RECOMMENDATIONS, {
    variables: { date },
  });

  const savedTodos = savedTodosData?.getSavedTodos || [];
  const recommendationHistory = recommendationsData?.getUserProfile?.recommendationsHistory || [];
  const currentDateRecommendations = recommendationHistory.find(
    (history) => history.date === date
  )?.recommendations?.todoList || [];

  // Use recommendations if available, otherwise use passed todoList
  const displayTodoList = currentDateRecommendations.length > 0 ? 
    currentDateRecommendations : todoList;

  const [saveTodo] = useMutation(SAVE_TODO);
  const [regenerateTodos, { loading: regenerating }] =
    useMutation(REGENERATE_TODOS);
  const [loadingTodo, setLoadingTodo] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [localTodoList, setLocalTodoList] = useState([]);

  useEffect(() => {
    if (todoList && todoList.length > 0) {
      const updatedTodoList = todoList.map((todo, index) => {
        const existingSavedTodo = savedTodos.find(
          (savedTodo) => savedTodo === todo
        );
        return existingSavedTodo || todo;
      });
      setLocalTodoList(updatedTodoList);
    }
  }, [todoList, savedTodosData]);

  const handleRegenerateTodos = async () => {
    try {
      setIsRegenerating(true);
      const response = await regenerateTodos({
        variables: { date },
        refetchQueries: [{ query: GET_RECOMMENDATIONS }],
      });

      setTimeout(() => {
        setIsRegenerating(false);
        Alert.alert("Success", "Todo list has been regenerated!");
      }, 1500);
    } catch (error) {
      setIsRegenerating(false);
      Alert.alert("Error", "Failed to regenerate todo list");
    }
  };

  const handleSaveTodo = async (todo) => {
    setLoadingTodo(todo);
    setShowSuccess(false);
    try {
      // Check if todo already exists for this date
      const existingTodo = savedTodos.find(t => t.todoItem === todo);
      if (existingTodo) {
        Alert.alert("Todo already exists for this date");
        return;
      }

      await saveTodo({
        variables: { todoItem: todo, date: date },
        refetchQueries: [{ query: GET_SAVED_TODOS }],
      });
      await refetch();

      const calendarStatus = await Calendar.requestCalendarPermissionsAsync();
      if (calendarStatus.status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        const defaultCalendar = calendars.find(
          (cal) => cal.allowsModifications
        );

        if (defaultCalendar) {
          await Calendar.createEventAsync(defaultCalendar.id, {
            title: todo,
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + 30 * 60 * 1000),
            timeZone: "GMT",
          });
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        setLoadingTodo(null);
        setShowSuccess(false);
      }, 1500);
    } catch (error) {
      Alert.alert("Error saving todo", error.message);
      setLoadingTodo(null);
    }
  };

  const renderTodoItem = (todo, index) => {
    console.log(savedTodos, "<<<saveTodo");
    const isSaved = savedTodos.map((el) => el.todoItem).includes(todo);
    const isLoading = loadingTodo === todo;
    const showRegeneratingOverlay = isRegenerating && !isSaved;
    const animations = ["fadeInLeft", "fadeInRight"];
    const animation = animations[index % 2];

    return (
      <Animatable.View
        animation={animation}
        delay={index * 100}
        style={styles.cardContainer}
        key={index}
      >
        <Animatable.View
          animation={isSaved ? "pulse" : undefined}
          duration={1000}
          style={styles.animationWrapper}
        >
          <LinearGradient
            colors={isSaved ? ["#FFF5F3", "#FFF5F3"] : ["#FFB5A7", "#FF9A8A"]}
            style={[styles.card, isSaved && styles.savedCard]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {(isLoading || showRegeneratingOverlay) && (
              <View style={styles.loadingOverlay}>
                <Animatable.View
                  animation={showSuccess ? "bounceIn" : undefined}
                >
                  {showSuccess ? (
                    <Feather name="check-circle" size={40} color="#FF9A8A" />
                  ) : (
                    <ActivityIndicator size="large" color="#FF9A8A" />
                  )}
                </Animatable.View>
              </View>
            )}
            <View style={styles.todoContent}>
              <Feather
                name={isSaved ? "check-circle" : "circle"}
                size={24}
                color={isSaved ? "#FF9A8A" : "#FFF"}
                style={styles.icon}
              />
              <Text style={[styles.todoText, isSaved && styles.savedTodoText]}>
                {todo}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.saveButton, isSaved && styles.savedButton]}
              onPress={() => handleSaveTodo(todo)}
              disabled={isLoading || showRegeneratingOverlay}
            >
              <Text
                style={[
                  styles.saveButtonText,
                  isSaved && styles.savedButtonText,
                ]}
              >
                {isSaved ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animatable.View>
      </Animatable.View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Your Healing Journey
        </Animatable.Text>
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {localTodoList?.map((todo, index) => renderTodoItem(todo, index))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.regenerateButton,
              regenerating && styles.regeneratingButton,
            ]}
            onPress={handleRegenerateTodos}
            disabled={regenerating}
          >
            <Feather
              name="refresh-cw"
              size={20}
              color="#FF9A8A"
              style={styles.buttonIcon}
            />
            <Text style={styles.regenerateButtonText}>
              {regenerating ? "Regenerating..." : "Regenerate"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather
              name="x"
              size={20}
              color="#FFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F3",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#FF9A8A",
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardContainer: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 12,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: "#FFF",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 154, 138, 0.2)",
  },
  regenerateButton: {
    backgroundColor: "#FFF5F3",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#FF9A8A",
  },
  closeButton: {
    backgroundColor: "#FF9A8A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonIcon: {
    marginRight: 8,
  },
  regenerateButtonText: {
    color: "#FF9A8A",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  savedCard: {
    borderWidth: 2,
    borderColor: "#FF9A8A",
  },
  savedTodoText: {
    color: "#FF9A8A",
  },
  savedButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF9A8A",
  },
  savedButtonText: {
    color: "#FF9A8A",
  },
  regeneratingButton: {
    opacity: 0.7,
  },
  animationWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    zIndex: 1,
  },
});

export default TodoList;
