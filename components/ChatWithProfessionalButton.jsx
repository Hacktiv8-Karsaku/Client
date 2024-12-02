import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const ChatWithProfessionalButton = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Professionals');
  };

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={handlePress}
    >
      <Feather name="message-circle" size={24} color="#FFF" />
      <Text style={styles.buttonText}>Chat with Professional</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9A8A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ChatWithProfessionalButton; 