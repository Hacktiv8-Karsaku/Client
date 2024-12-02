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
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { Menu, Provider } from "react-native-paper";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SAVED_TODOS,
  DELETE_TODO,
  GET_USER_PROFILE,
} from "../graphql/queries";

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

const ProfilePage = () => {
  const { setIsSignedIn } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    loading: todosLoading,
    error: todosError,
    data: todosData,
  } = useQuery(GET_SAVED_TODOS);
  const {
    loading: profileLoading,
    error: profileError,
    data: profileData,
  } = useQuery(GET_USER_PROFILE);
  const [deleteTodo] = useMutation(DELETE_TODO);

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
              refetchQueries: [{ query: GET_SAVED_TODOS }],
            });
          } catch (error) {
            Alert.alert("Error", "Failed to delete todo item");
          }
        },
      },
    ]);
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
                uri: "https://i.pinimg.com/736x/87/06/ee/8706ee1d850898c03d1e0a845df81040.jpg",
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
              <Feather name="smile" size={24} color="#FF9A8A" />
              <Text style={styles.pointsText}>HTML/CSS</Text>
            </View>
            <View style={styles.pointsItem}>
              <Feather name="monitor" size={24} color="#FF9A8A" />
              <Text style={styles.pointsText}>Graphic design</Text>
            </View>
          </View>

          <View style={styles.savedTodosContainer}>
            <Text style={styles.sectionTitle}>Saved Todos</Text>
            {todosLoading ? (
              <Text>Loading...</Text>
            ) : todosError ? (
              <Text>Error loading saved todos</Text>
            ) : (
              todosData?.getSavedTodos?.map((todo, index) => (
                <View key={index} style={styles.todoItem}>
                  <Text style={styles.todoText}>{todo}</Text>
                  <TouchableOpacity
                    onPress={() => handleDelete(todo)}
                    style={styles.deleteButton}
                  >
                    <Feather name="trash-2" size={20} color="#FF9A8A" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

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
    marginBottom: 40
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  todoItem: {
    backgroundColor: "#FFF5F3",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FF9A8A",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
});

export default ProfilePage;
