import React from 'react';
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
import { Feather } from '@expo/vector-icons';

const GET_USER_ENDED_CHATS = gql`
  query GetUserChats {
    getUserChats {
      _id
      isEnded
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

export default function UserChatHistory() {
  const navigation = useNavigation();
  const { loading, error, data, refetch } = useQuery(GET_USER_ENDED_CHATS);

  const handleChatPress = (chatId) => {
    navigation.navigate('Chat', {
      chatId,
    });
  };

  const renderChatItem = ({ item }) => {
    if (!item.isEnded) return null; // Only show ended chats

    const professional = item.participants?.find(p => p?.role === 'professional');
    const lastMessage = item.messages?.length > 0 ? item.messages[item.messages.length - 1] : null;

    if (!professional) return null;

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => handleChatPress(item._id)}
      >
        <View style={styles.chatInfo}>
          <Text style={styles.professionalName}>{professional.name}</Text>
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF9A8A" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading chat history</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={refetch}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const endedChats = data?.getUserChats?.filter(chat => chat.isEnded) || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat History</Text>
      {endedChats.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noChatsText}>No chat history available</Text>
        </View>
      ) : (
        <FlatList
          data={endedChats}
          renderItem={renderChatItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F3',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    backgroundColor: '#FFF',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chatInfo: {
    flex: 1,
  },
  professionalName: {
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
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
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
  noChatsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});
