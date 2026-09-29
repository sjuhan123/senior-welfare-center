import { useEffect } from 'react';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connectSocket, disconnectSocket } from './libs/socket';
import Auth from './pages/Auth';
import AccountCreated from './pages/AccountCreated';
import Center from './pages/Center/Center';
import MealCalendar from './pages/MealCalendar/MealCalendar';
import Chat from './pages/Chat/Chat';
import NoticeRoom from './pages/NoticeRoom/NoticeRoom';
import ChatRoom from './pages/ChatRoom/ChatRoom';
import Feed from './pages/Feed';
import Me from './pages/Me';
import TabBar from './components/TabBar';
import QrScan from './pages/QrScan';
import JoinSuccess from './pages/JoinSuccess';
import type { MembershipRole } from '@common/shared';

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
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  MealCalendar: undefined;
  NoticeRoom: { welfareId: string; roomId: string; roomTitle: string };
  ChatRoom: { welfareId: string; roomId: string; roomTitle: string };
};

export type InitialRouteName = 'Auth' | 'AccountCreated' | 'MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  /** 가입한 복지관이 있어야만 들어올 수 있는 화면이라, 여기서 멤버십을 다시 확인하지 않고 바로 연결함 */
  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Center" component={Center} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Me" component={Me} />
    </Tab.Navigator>
  );
};

type RoutersProps = { initialRouteName: InitialRouteName };

const Routers = ({ initialRouteName }: RoutersProps) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="AccountCreated" component={AccountCreated} />
      <Stack.Screen name="QrScan" component={QrScan} />
      <Stack.Screen name="JoinSuccess" component={JoinSuccess} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="MealCalendar" component={MealCalendar} />
      <Stack.Screen name="NoticeRoom" component={NoticeRoom} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  );
};

export default Routers;
