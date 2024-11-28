import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Picker } from 'react-native';

const RegisterPage = () => {
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
});

export default RegisterPage;
