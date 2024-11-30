import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSubscription, useMutation } from '@apollo/client';
import { WAITING_ROOM_SUBSCRIPTION, ACCEPT_NEXT_PATIENT } from '../graphql/mutations';
import { useNavigation } from '@react-navigation/native';

const DoctorDashboard = ({ route }) => {
  const { doctorId } = route.params;
  const [acceptNextPatient] = useMutation(ACCEPT_NEXT_PATIENT);
  const navigation = useNavigation();
  
  const { data } = useSubscription(WAITING_ROOM_SUBSCRIPTION, {
    variables: { doctorId },
  });

  const handleAcceptPatient = async (patientId) => {
    try {
      const { data } = await acceptNextPatient({
        variables: { patientId },
      });
      
      if (data?.acceptNextPatient) {
        navigation.navigate('VideoCall', { 
          roomId: data.acceptNextPatient.roomId 
        });
      }
    } catch (error) {
      console.error('Error accepting patient:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waiting Patients</Text>
      <ScrollView style={styles.waitingList}>
        {data?.waitingRoomUpdated.patients.map((patient) => (
          <View key={patient.userId} style={styles.patientCard}>
            <Text style={styles.patientName}>{patient.username}</Text>
            <Text style={styles.patientInfo}>
              Waiting since: {new Date(patient.waitingSince).toLocaleTimeString()}
            </Text>
            <Text style={styles.patientInfo}>
              Consultation: {patient.consultationType}
            </Text>
            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={() => handleAcceptPatient(patient.userId)}
            >
              <Text style={styles.buttonText}>Accept Patient</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  waitingList: {
    flex: 1
  },
  patientCard: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 10
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  patientInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  acceptButton: {
    backgroundColor: '#FF9A8A',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});

export default DoctorDashboard; 