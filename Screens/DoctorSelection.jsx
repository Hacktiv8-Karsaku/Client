import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_AVAILABLE_DOCTORS = gql`
  query GetAvailableDoctors {
    getAvailableDoctors {
      _id
      name
      specialization
      yearsOfExperience
      isAvailable
      imageUrl
      estimatedWaitTime
    }
  }
`;

const DoctorSelection = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_AVAILABLE_DOCTORS);
  
  const handleSelectDoctor = (doctorId) => {
    navigation.navigate("WaitingRoom", {
      userId: userId,
      doctorId: doctorId,
      consultationType: "general"
    });
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error loading doctors: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Doctor</Text>
      <FlatList
        data={data?.getAvailableDoctors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.doctorCard}
            onPress={() => handleSelectDoctor(item._id)}
            disabled={!item.isAvailable}
          >
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.doctorImage}
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>Dr. {item.name}</Text>
              <Text style={styles.specialization}>{item.specialization}</Text>
              <Text>Experience: {item.yearsOfExperience} years</Text>
              <Text style={item.isAvailable ? styles.available : styles.unavailable}>
                {item.isAvailable ? 
                  `Available (${item.estimatedWaitTime} min wait)` : 
                  'Currently Unavailable'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  doctorCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    elevation: 2,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  available: {
    color: 'green',
    marginTop: 4,
  },
  unavailable: {
    color: 'red',
    marginTop: 4,
  },
});

export default DoctorSelection; 