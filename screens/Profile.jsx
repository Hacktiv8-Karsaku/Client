import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { Menu, Provider } from "react-native-paper";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  GET_SAVED_TODOS,
  DELETE_TODO,
  GET_USER_PROFILE,
  UPDATE_TODO_STATUS,
} from "../graphql/queries";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ImageCard = ({ imageUrl, title }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const generateDates = () => {
  const dates = [];
  const today = new Date();

  // Generate 30 hari sebelum dan sesudah hari ini
  for (let i = -30; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const ProfilePage = () => {
  const { setIsSignedIn } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    loading: todosLoading,
    error: todosError,
    data: todosData,
    refetch: refetchTodos,
  } = useQuery(GET_SAVED_TODOS, {
    variables: { date: new Date(selectedDate) },
  });
  console.log({ date: new Date(selectedDate) });

  const [
    getUserProfile,
    {
      loading: profileLoading,
      error: profileError,
      data: profileData,
      refetch,
    },
  ] = useLazyQuery(GET_USER_PROFILE);
  const [deleteTodo] = useMutation(DELETE_TODO, { variables: { id: userId } });
  const [updateTodoStatus] = useMutation(UPDATE_TODO_STATUS);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const dates = generateDates();
  console.log(selectedDate, "<<<selectedDate");

  const placeToGoData = [
    {
      id: "1",
      uri: "https://cdn.idntimes.com/content-images/community/2022/09/tempat-wisata-dunia-yang-bikin-pengunjung-bahagia-tempat-wisata-dunia-paling-bahagia-bali-destinasi-wisata-paling-bahagia-bali-indoensia-wisata-9cde86371d7fc78c91ae80a6ffab250e-404157d92ecd7d9e35661cbe798808dc.jpg",
      title: "Bali",
    },
    {
      id: "2",
      uri: "https://cdn1.sisiplus.co.id/media/sisiplus/asset/uploads/artikel/g2OEbKl2aTEIp1x5hFNYEE9ad615uVenBexDAcVW.jpg",
      title: "Yogyakarta",
    },
    {
      id: "3",
      uri: "https://img.inews.co.id/media/600/files/networks/2024/05/13/d4b74_rans-nusantara-hebat.jpeg",
      title: "Nusantara",
    },
    {
      id: "4",
      uri: "https://media.disneylandparis.com/d4th/en-int/images/HD13302_2_2050jan01_world_disneyland-park-dlp-website-visual_5-2_tcm787-248638.jpg?w=1920",
      title: "Disneyland",
    },
  ];

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsSignedIn(false);
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleDelete = async (todoItem) => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo({
              variables: { todoItem },
              refetchQueries: [
                {
                  query: GET_SAVED_TODOS,
                },
              ],
            });
            await refetchTodos();
          } catch (error) {
            Alert.alert("Error", "Failed to delete todo item");
          }
        },
      },
    ]);
  };

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirm = (date) => {
    setSelectedDate(new Date(date));
    hideDatePicker();
  };

  // Fungsi untuk memastikan tanggal valid
  const parseDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  // Fungsi untuk mengecek todo pada tanggal tertentu
  const hasTodoOnDate = (date) => {
    if (!todosData?.getSavedTodos) return false;
    return todosData.getSavedTodos.some((todo) => {
      try {
        const todoDate = parseDate(todo.date);
        return format(todoDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      } catch {
        return false;
      }
    });
  };

  const handleToggleStatus = async (todoItem, currentStatus) => {
    try {
      console.log({ todoItem, currentStatus });

      await updateTodoStatus({
        variables: {
          todoItem: todoItem,
          status: currentStatus === "pending" ? "success" : "pending",
        },
        refetchQueries: [{ query: GET_SAVED_TODOS }],
      });
      await refetchTodos();
    } catch (error) {
      Alert.alert("Error", "Failed to update todo status");
    }
  };

  // Fungsi render todo list yang diperbarui
  const renderTodoList = () => {
    if (todosLoading) return <Text>Loading...</Text>;
    if (todosError) return <Text>Error loading saved todos</Text>;

    const todosForSelectedDate = todosData?.getSavedTodos || [];

    if (todosForSelectedDate.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No tasks for this date</Text>
        </View>
      );
    }

    return todosForSelectedDate.map((todo, index) => (
      <View key={index} style={styles.todoItem}>
        <View style={styles.todoLeftSection}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleToggleStatus(todo.todoItem, todo.status)}
          >
            <Feather
              name={todo.status === "success" ? "check-square" : "square"}
              size={20}
              color="#FF9A8A"
            />
          </TouchableOpacity>
          <View style={styles.todoTextContainer}>
            <Text
              style={[
                styles.todoText,
                todo.status === "success" && styles.completedTodoText,
              ]}
            >
              {todo.todoItem} - {todo.status}
            </Text>
            <Text style={styles.todoDate}>
              {format(parseDate(todo.date), "dd MMM", { locale: id })}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(todo.todoItem)}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={20} color="#FF9A8A" />
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Feather name="arrow-left" size={24} color="#FF9A8A" />
            <Text style={styles.title}>Your Profile</Text>
            <Menu
              visible={menuVisible}
              onDismiss={toggleMenu}
              anchor={
                <TouchableOpacity onPress={toggleMenu}>
                  <Feather name="menu" size={24} color="#FF9A8A" />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={handleLogout}
                title="Logout"
                titleStyle={{ color: "#FF9A8A", fontWeight: "bold" }}
              />
            </Menu>
          </View>

          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: `https://avatar.iran.liara.run/public?username=${profileData?.getUserProfile?.username}`,
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>
              {profileLoading
                ? "Loading..."
                : profileError
                ? "Error loading profile"
                : profileData?.getUserProfile?.name || "Anonymous"}
            </Text>
          </View>

          <View style={styles.pointsContainer}>
            <View style={styles.pointsItem}>
              <Feather name="clipboard" size={24} color="#FF9A8A" />
              <Text style={styles.pointsText}>
                {todosLoading
                  ? "-"
                  : todosError
                  ? "0"
                  : todosData?.getSavedTodos?.length || 0}
              </Text>
            </View>
            <View style={styles.pointsItem}>
              <Entypo name="location" size={24} color="#FF9A8A" />
              <Text style={styles.pointsText}>Location</Text>
            </View>
            <View style={styles.pointsItem}>
              <Feather name="monitor" size={24} color="#FF9A8A" />
              <Text style={styles.pointsText}>Job</Text>
            </View>
          </View>

          <View style={styles.calendarSection}>
            <View style={styles.weekDays}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, i) => (
                  <Text key={i} style={styles.weekDayText}>
                    {day}
                  </Text>
                )
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.datesRow}>
                {dates.map((date, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.dateBox,
                      format(date, "yyyy-MM-dd") ===
                        format(selectedDate, "yyyy-MM-dd") &&
                        styles.selectedDate,
                      hasTodoOnDate(date) && styles.hasTaskDate,
                    ]}
                    onPress={() => handleConfirm(date)}
                  >
                    <Text
                      style={[
                        styles.dateNumber,
                        format(date, "yyyy-MM-dd") ===
                          format(new Date(), "yyyy-MM-dd") && styles.todayText,
                        format(date, "yyyy-MM-dd") ===
                          format(selectedDate, "yyyy-MM-dd") &&
                          styles.selectedDateText,
                      ]}
                    >
                      {format(date, "d")}
                    </Text>
                    {hasTodoOnDate(date) && (
                      <View style={styles.taskIndicator} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.savedTodosContainer}>
            <Text style={styles.sectionTitle}>Today Task</Text>
            {renderTodoList()}
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            date={selectedDate}
          />

          <View style={styles.placeToGoContainer}>
            <Text style={styles.placeToGoTitle}>Place To Go</Text>
            <FlatList
              data={placeToGoData}
              renderItem={({ item }) => (
                <ImageCard imageUrl={item.uri} title={item.title} />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContainer}
            />
            <Text style={styles.viewAll}>View all</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F3",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  pointsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    backgroundColor: "#FFF5F3",
  },
  pointsItem: {
    alignItems: "center",
  },
  pointsText: {
    fontSize: 16,
    marginTop: 4,
    color: "#FF9A8A",
  },
  placeToGoContainer: {
    marginHorizontal: 16,
    marginBottom: 40,
  },
  placeToGoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 16,
  },
  card: {
    height: 150,
    width: 250,
    borderRadius: 8,
    marginRight: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewAll: {
    fontSize: 14,
    color: "#FF9A8A",
    textAlign: "right",
    marginTop: 8,
  },
  savedTodosContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  todoItem: {
    backgroundColor: "#FFF5F3",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  todoLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  todoDate: {
    fontSize: 12,
    color: "#666",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#8AFF8A",
  },
  calendarSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  weekDayText: {
    color: "#666",
    fontSize: 12,
    width: 35,
    textAlign: "center",
  },
  datesScrollView: {
    flexGrow: 0,
  },
  datesRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  dateBox: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 2,
  },
  selectedDate: {
    backgroundColor: "#FF9A8A",
  },
  dateNumber: {
    fontSize: 14,
    color: "#333",
  },
  selectedDateText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  todayText: {
    color: "#FF9A8A",
    fontWeight: "bold",
  },
  hasTaskDate: {
    position: "relative",
  },
  taskIndicator: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF9A8A",
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  emptyStateText: {
    color: "#666",
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  completedTodoText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
});

export default ProfilePage;
