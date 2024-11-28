import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const RegisterPage = ({navigation}) => {
  const [gender, setGender] = React.useState('');
  const [job, setJob] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Full Name" />
      <TextInput style={styles.input} placeholder="Username" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry={true} />
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}>
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>
      <Picker
        selectedValue={job}
        style={styles.picker}
        onValueChange={(itemValue) => setJob(itemValue)}>
        <Picker.Item label="Select Job" value="" />
        <Picker.Item label="Developer" value="developer" />
        <Picker.Item label="Designer" value="designer" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <Text style={styles.loginPrompt}>
        Already have account?{' '}
        <Text style={styles.LoginLink} onPress={() => navigation.navigate('Login')}>
          Login here
        </Text>
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F3',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9A8A',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9A8A',
  },
  picker: {
    width: '80%',
    height: 50,
    marginVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9A8A',
  },
  button: {
    marginTop: 20,
    width: '80%',
    backgroundColor: '#FF9A8A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPrompt: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
  },
  LoginLink: {
    color: '#FF9A8A',
    fontWeight: 'bold',
  },
});

export default RegisterPage;
