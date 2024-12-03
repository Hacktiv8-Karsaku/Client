import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfessionalLoginButton = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('LoginProfessional');
  };

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>You are a professional? Login here</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF9A8A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
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
  },
});

export default ProfessionalLoginButton; 