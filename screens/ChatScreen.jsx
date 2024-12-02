import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import io from 'socket.io-client';
import { SafeAreaView } from 'react-native-safe-area-context';

const GET_CHAT = gql`
  query GetChat($chatId: ID!) {
    getChat(chatId: $chatId) {
      _id
      messages {
        _id
        content
        timestamp
        sender
        senderDetails {
          _id
          name
          role
        }
      }
      participants {
        _id
        name
        role
      }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID!, $content: String!) {
    sendMessage(chatId: $chatId, content: $content) {
      _id
      messages {
        _id
        content
        timestamp
        sender
        senderDetails {
          _id
          name
          role
        }
      }
    }
  }
`;

const Message = ({ message, isUser }) => (
  <View style={[
    styles.messageContainer,
    isUser ? styles.userMessage : styles.professionalMessage
  ]}>
    <Text style={[
      styles.messageSender,
      isUser ? styles.userSender : styles.professionalSender
    ]}>
      {message.senderDetails.name}
    </Text>
    <Text style={[
      styles.messageContent,
      isUser ? styles.userContent : styles.professionalContent
    ]}>
      {message.content}
    </Text>
    <Text style={styles.messageTime}>
      {new Date(message.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}
    </Text>
  </View>
);

const ChatScreen = ({ route, navigation }) => {
  const { chatId, professionalName } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef();
  const socketRef = useRef();

  const { loading, error, data } = useQuery(GET_CHAT, {
    variables: { chatId },
    onCompleted: (data) => {
      setMessages(data.getChat.messages);
    },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    // Set navigation title
    navigation.setOptions({
      title: professionalName,
    });

    // Connect to Socket.IO server
    socketRef.current = io('http://localhost:3000');

    // Join chat room
    socketRef.current.emit('join', chatId);

    // Listen for new messages
    socketRef.current.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketRef.current.emit('leave', chatId);
      socketRef.current.disconnect();
    };
  }, [chatId, professionalName, navigation]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const { data } = await sendMessage({
        variables: { chatId, content: message.trim() },
      });

      // Emit message through socket
      socketRef.current.emit('sendMessage', {
        chatId,
        message: data.sendMessage.messages[data.sendMessage.messages.length - 1],
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
        <Text style={styles.errorText}>Error loading chat</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <Message 
              message={item} 
              isUser={item.senderDetails.role === 'user'}
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]} 
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Feather name="send" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F3',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F3',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF9A8A',
    borderBottomRightRadius: 4,
  },
  professionalMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    fontSize: 12,
    marginBottom: 4,
  },
  userSender: {
    color: '#FFF',
  },
  professionalSender: {
    color: '#666',
  },
  messageContent: {
    fontSize: 16,
  },
  userContent: {
    color: '#FFF',
  },
  professionalContent: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#FF9A8A',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
  },
});

export default ChatScreen; 