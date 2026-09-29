import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useSetAtom } from 'jotai';
import Routers, { type InitialRouteName } from './router';
import { FONT_ASSETS } from './constant/fonts';
import { navigationRef } from './refs/navigationRef';
import { getRefreshToken } from './utills/persistentStorage';
import { getUserInfo } from './hooks/api/auth/useGetUserInfo';
import { getMemberships } from './hooks/api/membership/useGetMemberships';
import { isUserTokenValidAtom } from './store/auth';
import { userInfoAtom } from './store/user';
import { QUERY_KEYS } from './constant/queryKeys';

const App = () => {
  const [fontsLoaded] = useFonts(FONT_ASSETS);
  const [initialRouteName, setInitialRouteName] = useState<InitialRouteName | null>(null);
  const setIsUserTokenValid = useSetAtom(isUserTokenValidAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  /** 콜드부트 세션 복원: 저장된 refreshToken이 있으면 로그인 화면을 건너뜀. 41. 로그인 인증 흐름 참고. */
  useEffect(() => {
    void (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        setInitialRouteName('Auth');
        return;
      }

      try {
        const userInfoRes = await queryClient.fetchQuery({ queryKey: [QUERY_KEYS.USER_INFO], queryFn: getUserInfo });
        const membershipsRes = await queryClient.fetchQuery({ queryKey: [QUERY_KEYS.MEMBERSHIPS], queryFn: getMemberships });

        setIsUserTokenValid(true);
        setUserInfo({ userName: userInfoRes.data.userName, userAvatar: userInfoRes.data.userAvatar });
        setInitialRouteName(membershipsRes.data.length > 0 ? 'MainTabs' : 'AccountCreated');
      } catch {
        setInitialRouteName('Auth');
      }
    })();
  }, [queryClient, setIsUserTokenValid, setUserInfo]);

  if (!fontsLoaded || !initialRouteName) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer ref={navigationRef}>
            <Routers initialRouteName={initialRouteName} />
          </NavigationContainer>
        </QueryClientProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
};

export default App;
