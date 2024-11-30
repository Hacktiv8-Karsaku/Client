import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { Video } from 'expo-av';

const VideoCall = ({ route }) => {
  const { roomId } = route.params;
  const socket = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO with reconnection options
    socket.current = io(process.env.EXPO_PUBLIC_API_URL, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    
    // Join room
    const joinRoom = () => {
      socket.current.emit('join-room', roomId);
      console.log('Joined room:', roomId);
    };

    // Handle connection events
    socket.current.on('connect', joinRoom);
    socket.current.on('reconnect', joinRoom);
    
    socket.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      // Attempt to reconnect
      socket.current.connect();
    });

    // Keep-alive ping
    const pingInterval = setInterval(() => {
      if (socket.current?.connected) {
        socket.current.emit('ping');
      }
    }, 5000);

    return () => {
      clearInterval(pingInterval);
      socket.current?.disconnect();
    };
  }, [roomId]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Room ID: {roomId}</Text>
      {/* Video components will be added when implementing camera functionality */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  }
});

export default VideoCall;