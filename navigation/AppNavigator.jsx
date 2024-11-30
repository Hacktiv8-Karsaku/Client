import { createStackNavigator } from '@react-navigation/stack';
import DoctorSelection from '../screens/DoctorSelection';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="DoctorSelection" 
        component={DoctorSelection}
        options={{
          title: 'Select Doctor',
          headerTintColor: '#FF9A8A'
        }}
      />
      <Stack.Screen name="WaitingRoom" component={WaitingRoom} />
      <Stack.Screen name="VideoCall" component={VideoCall} />
      {/* Other screens */}
    </Stack.Navigator>
  );
};

export default AppNavigator; 