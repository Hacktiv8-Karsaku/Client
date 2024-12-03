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
  Alert,
} from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
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

const SEND_MESSAGE_PROFESSIONAL = gql`
  mutation SendMessageProfessional($chatId: ID!, $content: String!) {
    sendMessageProfessional(chatId: $chatId, content: $content) {
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

const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const messageDate = new Date(parseInt(timestamp));
    const now = new Date();
    
    // Check if date is invalid
    if (isNaN(messageDate.getTime())) {
      return '';
    }
    
    // Same day - show time only
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + messageDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
    
    // Within last 7 days - show day name
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (messageDate > oneWeekAgo) {
      return messageDate.toLocaleDateString([], { 
        weekday: 'short'
      }) + ' ' + messageDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
    
    // Older messages - show full date
    return messageDate.toLocaleDateString([], { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' ' + messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const Message = ({ message, isUser }) => (
  <View style={[
    styles.messageContainer,
    isUser ? styles.userMessage : styles.professionalMessage
  ]}>
    <Text style={[
      styles.messageSender,
      isUser ? styles.userSender : styles.professionalSender
    ]}>
      {message.senderDetails?.name || 'Unknown'}
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

const ProfessionalChatScreen = ({ route, navigation }) => {
  const { chatId } = route.params;
  const [message, setMessage] = useState('');
  const flatListRef = useRef();

  const { loading, data, refetch } = useQuery(GET_CHAT, {
    variables: { chatId },
    pollInterval: 200,
    onCompleted: (data) => {
      if (data?.getChat) {
        const userParticipant = data.getChat.participants.find(p => p.role === 'user');
        navigation.setOptions({
          title: userParticipant?.name || 'Chat'
        });
      }
    }
  });

  const [sendMessageProfessional] = useMutation(SEND_MESSAGE_PROFESSIONAL, {
    onCompleted: () => {
      refetch(); // Refetch chat data after sending a message
    }
  });

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessageProfessional({
        variables: { chatId, content: message.trim() },
      });
      setMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }) => {
    const isProfessionalMessage = item.senderDetails?.role === 'professional';
    const formattedTime = formatMessageTime(item.timestamp);
    
    return (
      <View style={[
        styles.messageContainer,
        isProfessionalMessage ? styles.senderMessage : styles.receiverMessage
      ]}>
        <Text style={[
          styles.messageContent,
          isProfessionalMessage ? styles.senderContent : styles.receiverContent
        ]}>
          {item.content}
        </Text>
        {formattedTime && (
          <Text style={[
            styles.messageTime,
            isProfessionalMessage ? styles.senderTime : styles.receiverTime
          ]}>
            {formattedTime}
          </Text>
        )}
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#FF9A8A" />;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={data?.getChat?.messages || []}
          renderItem={renderMessage}
          keyExtractor={item => item._id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
          />
          <TouchableOpacity 
            style={styles.sendButton} 
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
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF9A8A',
    borderBottomRightRadius: 4,
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    fontSize: 12,
    marginBottom: 4,
  },
  userSender: {
    color: '#fff',
    textAlign: 'right',
  },
  professionalSender: {
    color: '#666',
  },
  messageContent: {
    fontSize: 16,
    marginBottom: 4,
  },
  senderContent: {
    color: '#FFF',
  },
  receiverContent: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
  },
  senderTime: {
    color: '#FFF',
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  receiverTime: {
    color: '#666',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF9A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF9A8A',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfessionalChatScreen; 