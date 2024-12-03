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
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

const VideoCallScreen = ({ route, navigation }) => {
  const { chatId, participantId } = route.params;
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [audioPermission, setAudioPermission] = useState(null);
  const socket = useRef(null);
  const [callStatus, setCallStatus] = useState('connecting');
  const recording = useRef(null);

  useEffect(() => {
    console.log('VideoCallScreen mounted');
    setupCall();
    requestAudioPermission();
    return () => {
      console.log('VideoCallScreen unmounted');
      if (socket.current) {
        socket.current.disconnect();
      }
      stopAudio();
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const stopAudio = async () => {
    try {
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        recording.current = null;
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const requestAudioPermission = async () => {
    try {
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      console.log('Audio permission status:', audioStatus);
      setAudioPermission(audioStatus === 'granted');

      if (audioStatus !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Microphone permission is required for video calls'
        );
        navigation.goBack();
      } else {
        await setupAudio();
      }
    } catch (error) {
      console.error('Error requesting audio permission:', error);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  };

  const setupCall = async () => {
    socket.current = io('http://your-server-url:4000', {
      transports: ['websocket'],
      path: '/socket.io',
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

    socket.current.emit('initiateCall', {
      callerId: userId,
      receiverId: participantId,
      chatId,
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const endCall = () => {
    socket.current.emit('endCall', { roomId: chatId });
    navigation.goBack();
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.waitingText}>Loading camera permissions...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.waitingText}>Camera permission is required</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainVideoArea}>
        {isVideoEnabled ? (
          <CameraView
            style={styles.camera}
            facing={facing}
            enableZoomGesture
          >
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Feather name="refresh-cw" size={20} color="#FFF" />
            </TouchableOpacity>
          </CameraView>
        ) : (
          <View style={styles.videoDisabledContainer}>
            <Feather name="video-off" size={40} color="#FFF" />
            <Text style={styles.videoDisabledText}>Camera is off</Text>
          </View>
        )}
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {callStatus === 'connecting' ? 'Connecting...' : 
           callStatus === 'connected' ? 'Connected' : 'Call Ended'}
        </Text>
      </View>

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
    backgroundColor: '#2a2a2a',
  },
  camera: {
    flex: 1,
  },
  waitingText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  permissionButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 40,
  },
  permissionButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoDisabledContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  videoDisabledText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
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
