import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = -30; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const getMonthName = (date) => {
  return format(date, "MMMM yyyy", { locale: id });
};

const DestinationCard = ({ destination }) => {
  return (
    <TouchableOpacity style={styles.destinationCard}>
      <Image
        source={{ uri: destination.uri }}
        style={styles.destinationImage}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradientOverlay}
      >
        <View style={styles.destinationInfo}>
          <Text style={styles.destinationTitle}>{destination.title}</Text>
          <View style={styles.destinationDetails}>
            <View style={styles.detailItem}>
              <Entypo name="location-pin" size={16} color="#FFF" />
              <Text style={styles.detailText}>{destination.location}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const ProfilePage = () => {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
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

  const [
    getUserProfile,
    {
      loading: profileLoading,
      error: profileError,
      data: profileData,
      refetch: refetchProfile,
    },
  ] = useLazyQuery(GET_USER_PROFILE);

  const [deleteTodo] = useMutation(DELETE_TODO, { variables: { id: userId } });
  const [updateTodoStatus] = useMutation(UPDATE_TODO_STATUS);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const dates = generateDates();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refetchProfile();
    refetchTodos();
  }, [userId, refetchProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      refetchTodos();
      refetchProfile();
      setRefreshing(false);
    }, 1000);
  }, []);

  const placeToGoData = [
    {
      id: "1",
      uri: "https://cdn.idntimes.com/content-images/community/2022/09/tempat-wisata-dunia-yang-bikin-pengunjung-bahagia-tempat-wisata-dunia-paling-bahagia-bali-destinasi-wisata-paling-bahagia-bali-indoensia-wisata-9cde86371d7fc78c91ae80a6ffab250e-404157d92ecd7d9e35661cbe798808dc.jpg",
      title: "Bali",
      location: "Indonesia",
      description:
        "Pulau dewata dengan keindahan alam dan budaya yang menakjubkan",
    },
    {
      id: "2",
      uri: "https://i.pinimg.com/736x/a0/7f/07/a07f078b53ee220baf76dd50c5d261b7.jpg",
      title: "Yogyakarta",
      location: "Indonesia",
      description: "Kota budaya dengan berbagai tempat bersejarah",
    },
    {
      id: "3",
      uri: "https://media.disneylandparis.com/d4th/en-int/images/HD13302_2_2050jan01_world_disneyland-park-dlp-website-visual_5-2_tcm787-248638.jpg?w=1920",
      title: "Disneyland",
      location: "California",
      description: "Taman hiburan terkenal di Amerika Serikat",
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
              variables: { todoItem: todoItem },
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

  const parseDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  const hasTodoOnDate = (date) => {
    if (!todosData?.getSavedTodos?.length) return false;

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

  const renderTodoList = () => {
    if (todosLoading) return <Text>Loading...</Text>;

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

  const scrollViewRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        const scrollToPosition = 30 * 40;
        scrollViewRef.current.scrollTo({
          x: scrollToPosition,
          animated: false,
        });
      }
    }, 100);
  }, []);

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF9A8A"
              colors={["#FF9A8A"]}
            />
          }
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack}>
              <Feather name="arrow-left" size={24} color="#FF9A8A" />
            </TouchableOpacity>
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
              <Text style={styles.pointsText} numberOfLines={1}>
                {todosLoading
                  ? "-"
                  : todosError
                  ? "0"
                  : todosData?.getSavedTodos?.length || 0}
              </Text>
            </View>
            <View style={styles.pointsItem}>
              <Entypo name="location" size={24} color="#FF9A8A" />
              <Text style={styles.pointsText} numberOfLines={1}>
                {profileLoading
                  ? "Loading..."
                  : profileError
                  ? "Error"
                  : profileData?.getUserProfile?.domicile || "Not set"}
              </Text>
            </View>
            <View style={styles.pointsItem}>
              <Feather name="monitor" size={24} color="#FF9A8A" />
              <Text style={styles.pointsText} numberOfLines={1}>
                {profileLoading
                  ? "Loading..."
                  : profileError
                  ? "Error"
                  : profileData?.getUserProfile?.job || "Not set"}
              </Text>
            </View>
          </View>

          <View style={styles.calendarSection}>
            <Text style={styles.monthText}>{getMonthName(selectedDate)}</Text>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View>
                <View style={styles.datesRow}>
                  {dates.map((date, i) => (
                    <View key={`day-${i}`} style={styles.dateColumn}>
                      <Text style={styles.weekDayText}>
                        {format(date, "E", { locale: id })}
                      </Text>
                      <TouchableOpacity
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
                              format(new Date(), "yyyy-MM-dd") &&
                              styles.todayText,
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
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={styles.savedTodosContainer}>
            <Text style={styles.sectionTitle}>Saved Task</Text>
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
            <View style={styles.sectionHeader}>
              <Text style={styles.placeToGoTitle}>Place To Go</Text>
            </View>
            <FlatList
              data={placeToGoData}
              renderItem={({ item }) => <DestinationCard destination={item} />}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.destinationList}
            />
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
    justifyContent: "space-between",
    marginVertical: 16,
    backgroundColor: "#FFF5F3",
    paddingHorizontal: 16,
  },
  pointsItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
    maxWidth: "33.33%",
  },
  pointsText: {
    fontSize: 14,
    marginTop: 4,
    color: "#FF9A8A",
    textAlign: "center",
    ellipsizeMode: "tail",
  },
  placeToGoContainer: {
    marginVertical: 20,
    marginBottom: 60,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  placeToGoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllButton: {
    color: "#FF9A8A",
    fontSize: 14,
  },
  destinationList: {
    paddingHorizontal: 16,
  },
  destinationCard: {
    width: 280,
    height: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  destinationImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    padding: 16,
    justifyContent: "flex-end",
  },
  destinationInfo: {
    gap: 8,
  },
  destinationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  destinationDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    color: "#FFF",
    fontSize: 14,
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
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  datesRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  dateColumn: {
    alignItems: "center",
    marginHorizontal: 2,
    width: 40,
  },
  weekDayText: {
    color: "#666",
    fontSize: 12,
    marginBottom: 4,
  },
  dateBox: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
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
