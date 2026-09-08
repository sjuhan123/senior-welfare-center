import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './pages/Main';
import Auth from './pages/Auth';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routers = () => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Main" component={Main} />
    </Stack.Navigator>
  );
};

export default Routers;
