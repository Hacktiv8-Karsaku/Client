import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useSubscription, useMutation } from '@apollo/client';
import { JOIN_WAITING_ROOM } from '../graphql/mutations';
import { CONSULTATION_READY } from '../graphql/subscriptions';

const WaitingRoom = ({ route, navigation }) => {
  const { userId, doctorId, consultationType } = route.params;
  const [waitingTime, setWaitingTime] = useState(0);
  const [error, setError] = useState(null);
  const [joinWaitingRoom] = useMutation(JOIN_WAITING_ROOM);

  useEffect(() => {
    const joinRoom = async () => {
      try {
        const { data } = await joinWaitingRoom({ 
          variables: { 
            consultationType,
            doctorId
          }
        });
        console.log('Joined waiting room:', data);
      } catch (error) {
        console.error('Join error:', error);
        setError(error.message);
        Alert.alert("Error", "Failed to join waiting room");
      }
    };
    
    joinRoom();
    
    const interval = setInterval(() => {
      setWaitingTime(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useSubscription(CONSULTATION_READY, {
    variables: { patientId: userId },
    onData: ({ data }) => {
      console.log('Subscription data:', data);
      if (data?.data?.consultationReady) {
        navigation.replace("VideoCall", {
          roomId: data.data.consultationReady.roomId
        });
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
      setError(error.message);
    }
  });

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waiting Room</Text>
      <View style={styles.waitingInfo}>
        <Text style={styles.text}>You are in line for: {consultationType}</Text>
        <Text style={styles.text}>Waiting time: {waitingTime} minutes</Text>
        <ActivityIndicator size="large" color="#FF9A8A" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  waitingInfo: {
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    marginBottom: 10
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20
  }
});

export default WaitingRoom;