import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Auth from './pages/Auth';
import AccountCreated from './pages/AccountCreated';
import Center from './pages/Center';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
import Me from './pages/Me';
import TabBar from './components/TabBar';
import QrScan from './pages/QrScan';
import JoinSuccess from './pages/JoinSuccess';
import type { MembershipRole } from './types/membership';

export type MainTabParamList = {
  Center: undefined;
  Chat: undefined;
  Feed: undefined;
  Me: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  AccountCreated: undefined;
  QrScan: undefined;
  JoinSuccess: { welfareName: string; role: MembershipRole };
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Center" component={Center} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Me" component={Me} />
    </Tab.Navigator>
  );
};

const Routers = () => {
  return (
    <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="AccountCreated" component={AccountCreated} />
      <Stack.Screen name="QrScan" component={QrScan} />
      <Stack.Screen name="JoinSuccess" component={JoinSuccess} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default Routers;
