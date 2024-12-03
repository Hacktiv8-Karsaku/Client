import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

const VideoCallScreen = ({ route, navigation }) => {
  const { chatId, participantId } = route.params;
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const socket = useRef(null);
  const [callStatus, setCallStatus] = useState('connecting');
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    console.log('VideoCallScreen mounted');
    setupCall();
    requestPermissions();
    return () => {
      console.log('VideoCallScreen unmounted');
      if (socket.current) {
        socket.current.disconnect();
      }
      stopAudio();
    };
  }, []);

  const requestPermissions = async () => {
    console.log('Requesting permissions...');
    try {
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      console.log('Audio permission status:', audioStatus);
      setHasAudioPermission(audioStatus === 'granted');

      if (audioStatus !== 'granted') {
        Alert.alert(
          'Permission needed', 
          'Microphone permission is required for calls'
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const setupCall = async () => {
    socket.current = io('http://your-server-url:4000', {
      transports: ['websocket'],
      path: '/socket.io'
    });

    const userId = await SecureStore.getItemAsync('user_id');
    socket.current.emit('register', { userId });

    socket.current.on('callAccepted', ({ roomId }) => {
      setCallStatus('connected');
    });

    socket.current.on('callRejected', () => {
      Alert.alert('Call Rejected', 'The other user rejected the call');
      navigation.goBack();
    });

    socket.current.on('callEnded', () => {
      setCallStatus('ended');
      navigation.goBack();
    });

    socket.current.on('peerDisconnected', () => {
      Alert.alert('Call Ended', 'The other user disconnected');
      navigation.goBack();
    });

    socket.current.emit('initiateCall', {
      callerId: userId,
      receiverId: participantId,
      chatId
    });
  };

  const toggleMute = async () => {
    setIsMuted(!isMuted);
    socket.current.emit('muteStatus', {
      roomId: chatId,
      isMuted: !isMuted
    });
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    socket.current.emit('videoStatus', {
      roomId: chatId,
      isVideoEnabled: !isVideoEnabled
    });
  };

  const endCall = () => {
    socket.current.emit('endCall', { roomId: chatId });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Video Area */}
      <View style={styles.mainVideoArea}>
        <Text style={styles.waitingText}>Waiting for other participant...</Text>
      </View>

      {/* Call Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {callStatus === 'connecting' ? 'Connecting...' : 
           callStatus === 'connected' ? 'Connected' : 'Call Ended'}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}
        >
          <Feather
            name={isMuted ? "mic-off" : "mic"}
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={endCall}
        >
          <Feather name="phone-off" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !isVideoEnabled && styles.controlButtonActive]}
          onPress={toggleVideo}
        >
          <Feather
            name={isVideoEnabled ? "video" : "video-off"}
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  mainVideoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  waitingText: {
    color: '#FFF',
    fontSize: 16,
  },
  statusContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#FF9A8A',
  },
  endCallButton: {
    backgroundColor: '#FF4444',
  },
});

export default VideoCallScreen; 