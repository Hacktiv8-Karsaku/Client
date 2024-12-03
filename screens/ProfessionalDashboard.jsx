import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Feather } from '@expo/vector-icons';
import { Menu, Provider } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const GET_PROFESSIONAL_CHATS = gql`
  query GetProfessionalChats {
    getProfessionalChats {
      _id
      participants {
        _id
        name
        role
      }
      messages {
        _id
        content
        timestamp
        sender
        senderDetails {
          name
          role
        }
      }
    }
  }
`;

export default function ProfessionalDashboard() {
  const navigation = useNavigation();
  const { setIsSignedIn } = React.useContext(AuthContext);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { loading, error, data, refetch } = useQuery(GET_PROFESSIONAL_CHATS, {
    pollInterval: 1000, // Auto-fetch every 200 milliseconds
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing chats:', error);
      Alert.alert('Error', 'Failed to refresh chats');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={handleRefresh}
            style={{ marginRight: 15 }}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#FF9A8A" />
            ) : (
              <Feather name="refresh-cw" size={24} color="#FF9A8A" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Feather name="menu" size={24} color="#FF9A8A" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, refreshing]);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('professional_id');
      await SecureStore.deleteItemAsync('role');
      setIsSignedIn(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleChatPress = (chatId) => {
    navigation.navigate('ProfessionalChat', {
      chatId,
    });
  };

  const renderChatItem = ({ item }) => {
    const user = item.participants?.find(p => p?.role === 'user');
    const lastMessage = item.messages?.length > 0 ? item.messages[item.messages.length - 1] : null;

    if (!user) return null;

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => handleChatPress(item._id)}
      >
        <View style={styles.chatInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          {lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.content}
            </Text>
          )}
          {lastMessage && (
            <Text style={styles.timestamp}>
              {new Date(lastMessage.timestamp).toLocaleTimeString()}
            </Text>
          )}
        </View>
        <Feather name="chevron-right" size={24} color="#FF9A8A" />
      </TouchableOpacity>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Chats</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={<View />} // Empty view since we moved the menu button to header
          >
            <Menu.Item
              onPress={handleLogout}
              title="Logout"
              titleStyle={{ color: '#FF9A8A' }}
            />
          </Menu>
        </View>

        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#FF9A8A" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Error loading chats</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={handleRefresh}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={data?.getProfessionalChats}
            renderItem={renderChatItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9A8A',
  },
  listContainer: {
    padding: 16,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  errorText: {
    textAlign: 'center',
    color: '#FF0000',
    margin: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF9A8A',
    borderRadius: 5,
  },
  retryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
}); 