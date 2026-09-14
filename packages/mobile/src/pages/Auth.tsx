import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSetAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import appIcon from '../../assets/icon.png';
import useKakaoLogin from '../hooks/auth/useKakaoLogin';
import { postAuthKakao } from '../hooks/api/auth/usePostAuthKakao';
import { getUserInfo } from '../hooks/api/auth/useGetUserInfo';
import { getMemberships } from '../hooks/api/membership/useGetMemberships';
import { setUserToken, setRefreshToken } from '../utills/persistentStorage';
import { isUserTokenValidAtom } from '../store/auth';
import { userInfoAtom } from '../store/user';
import useStyles, { type StyleFactoryArgs } from '../hooks/styles/useStyles';
import type { RootStackParamList } from '../router';

// 카카오 로그인 버튼의 공식 브랜드 색상(우리 디자인 토큰과는 무관, 카카오 자체 규정값)
const KAKAO_YELLOW = '#FEE500';
const KAKAO_TEXT = '#191919';

/**
 * 버튼 onPress
 * -> useKakaoLogin().login() 호출 (카카오 SDK, 카카오톡 앱 전환 또는 웹 로그인)
 * -> 카카오 access token 반환받음
 * -> 그 토큰을 그대로 서버에 넘겨 code 교환 없이 바로 사용자 정보 조회
 * -> 서버 토큰 저장 -> 유저정보 조회 -> 가입한 복지관 조회
 * -> 가입한 복지관이 있으면 MainTabs, 없으면 AccountCreated로 이동
 */

const Auth = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useKakaoLogin();
  const setIsUserTokenValid = useSetAtom(isUserTokenValidAtom);
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

      const membershipsRes = await getMemberships();
      const hasMembership = membershipsRes.data.length > 0;

      navigation.replace(hasMembership ? 'MainTabs' : 'AccountCreated');
    } catch (error) {
      console.error('로그인 처리 실패', error);
      setStatus('error');
    }
  };

  const styles = useStyles(authStyleFactory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={appIcon} style={styles.logo} />
        <Text style={styles.title}>우리복지관</Text>
        <Text style={styles.subtitle}>복지관 소식과 강좌 신청을{'\n'}한곳에서 보실 수 있습니다.</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            쓰시던 카카오 계정으로 시작합니다.{'\n'}
            <Text style={styles.infoBoxBold}>이름은 카카오에 있는 이름을 그대로 씁니다.</Text>
            {'\n'}따로 적으실 것은 없습니다.
          </Text>
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.primaryButton} onPress={handlePressButton} disabled={status === 'loading'}>
          <Text style={styles.primaryButtonText}>{status === 'loading' ? '로그인 중...' : '카카오 계정으로 시작하기'}</Text>
        </Pressable>
        {status === 'error' && <Text style={styles.errorText}>로그인에 실패했습니다</Text>}
      </View>
    </SafeAreaView>
  );
};

const authStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.grey0,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 32,
    },
    logo: {
      width: 82,
      height: 82,
      borderRadius: 8,
    },
    title: {
      fontSize: fontSize('display'),
      fontFamily: fontFamily('bold'),
      marginTop: 24,
      color: semantic.textPrimary,
    },
    subtitle: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('semibold'),
      lineHeight: fontSize('lg') * 1.6,
      marginTop: 12,
      color: semantic.textSecondary,
    },
    infoBox: {
      marginTop: 26,
      padding: 18,
      backgroundColor: color.grey50,
      borderWidth: 1,
      borderColor: semantic.border,
      borderRadius: radius.mobileContainer,
    },
    infoBoxText: {
      fontSize: fontSize('md'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('md') * 1.7,
      color: semantic.textSecondary,
    },
    infoBoxBold: {
      fontFamily: fontFamily('bold'),
    },
    buttonGroup: {
      paddingHorizontal: 20,
      paddingBottom: 28,
      gap: 12,
    },
    primaryButton: {
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileButton,
      backgroundColor: KAKAO_YELLOW,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      color: KAKAO_TEXT,
    },
    errorText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      color: semantic.stateStopFg,
      textAlign: 'center',
      marginTop: 8,
    },
  });

export default Auth;
