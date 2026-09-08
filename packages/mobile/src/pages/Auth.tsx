import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useSetAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useKakaoLogin from '../hooks/auth/useKakaoLogin';
import { postAuthKakao } from '../hooks/api/auth/usePostAuthKakao';
import { getUserInfo } from '../hooks/api/auth/useGetUserInfo';
import { setUserToken, setRefreshToken } from '../utills/persistentStorage';
import { isUserTokenValidAtom } from '../store/auth';
import { bookmarkListAtom } from '../store/bookmarkList';
import { userInfoAtom } from '../store/user';
import type { RootStackParamList } from '../router';

/**
 * 버튼 onPress
 * -> useKakaoLogin().login() 호출 (카카오 SDK, 카카오톡 앱 전환 또는 웹 로그인)
 * -> 카카오 access token 반환받음
 * -> 그 토큰을 그대로 서버에 넘겨 code 교환 없이 바로 사용자 정보 조회
 * -> 서버 토큰 저장 -> 유저정보 조회 -> Main 이동
 */

const Auth = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useKakaoLogin();
  const setIsUserTokenValid = useSetAtom(isUserTokenValidAtom);
  const updateBookmarkList = useSetAtom(bookmarkListAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handlePressButton = async () => {
    setStatus('loading');

    const kakaoAccessToken = await login();
    if (!kakaoAccessToken) {
      setStatus('idle');
      return;
    }

    try {
      const tokenRes = await postAuthKakao(kakaoAccessToken);
      await setUserToken(tokenRes.data.accessToken);
      await setRefreshToken(tokenRes.data.refreshToken);
      setIsUserTokenValid(true);

      const userInfoRes = await getUserInfo();
      setUserInfo({
        userName: userInfoRes.data.userName,
        userAvatar: userInfoRes.data.userAvatar,
      });
      updateBookmarkList(userInfoRes.data.bookmarkWelfares);

      navigation.replace('MainTabs');
    } catch (error) {
      console.error('로그인 처리 실패', error);
      setStatus('error');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={handlePressButton} title={status === 'loading' ? '로그인 중...' : '로그인 버튼'} disabled={status === 'loading'} />
      {status === 'error' && <Text>로그인에 실패했습니다</Text>}
    </View>
  );
};

export default Auth;
