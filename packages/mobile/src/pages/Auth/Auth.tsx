import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSetAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import startIllust from '../../../assets/start-illust.png';
import kakaoSymbol from '../../../assets/kakao-symbol.png';
import AuthLogo from './components/AuthLogo';
import useKakaoLogin from '../../hooks/auth/useKakaoLogin';
import { postAuthKakao } from '../../hooks/api/auth/usePostAuthKakao';
import { postAuthDevLogin } from '../../hooks/api/auth/usePostAuthDevLogin';
import { getUserInfo } from '../../hooks/api/auth/useGetUserInfo';
import { getMemberships } from '../../hooks/api/membership/useGetMemberships';
import { setUserToken, setRefreshToken } from '../../utills/persistentStorage';
import { isUserTokenValidAtom } from '../../store/auth';
import { userInfoAtom } from '../../store/user';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';

// 카카오 로그인 버튼의 공식 브랜드 색상(우리 디자인 토큰과는 무관, 카카오 자체 규정값)
const KAKAO_YELLOW = '#FEE500';
const KAKAO_TEXT = '#272403';

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

  const finishLogin = async (tokens: { accessToken: string; refreshToken: string }) => {
    await setUserToken(tokens.accessToken);
    await setRefreshToken(tokens.refreshToken);
    setIsUserTokenValid(true);

    const userInfoRes = await getUserInfo();
    setUserInfo({
      userName: userInfoRes.data.userName,
      userAvatar: userInfoRes.data.userAvatar,
      customAvatar: userInfoRes.data.customAvatar,
    });

    const membershipsRes = await getMemberships();
    const hasMembership = membershipsRes.data.length > 0;

    navigation.replace(hasMembership ? 'MainTabs' : 'AccountCreated');
  };

  const handlePressButton = async () => {
    setStatus('loading');

    const kakaoAccessToken = await login();
    if (!kakaoAccessToken) {
      setStatus('idle');
      return;
    }

    try {
      const tokenRes = await postAuthKakao(kakaoAccessToken);
      await finishLogin(tokenRes.data);
    } catch (error) {
      console.error('로그인 처리 실패', error);
      setStatus('error');
    }
  };

  /** Expo Go에선 카카오 네이티브 SDK가 동작하지 않아 로그인 이후 화면을 테스트할 수 없어서 만든 개발 전용 우회 경로. 43. 개발용 테스트 로그인 참고. */
  const handlePressDevLoginButton = async () => {
    setStatus('loading');

    try {
      const tokenRes = await postAuthDevLogin();
      await finishLogin(tokenRes.data);
    } catch (error) {
      console.error('개발용 로그인 처리 실패', error);
      setStatus('error');
    }
  };

  const styles = useStyles(authStyleFactory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AuthLogo size={30} />
        <Text style={styles.headerWordmark}>우리 복지관</Text>
      </View>
      <View style={styles.content}>
        <Image source={startIllust} style={styles.illust} resizeMode="contain" />
        <Text style={styles.tagline}>매일 가까이, 든든하게</Text>
        <Text style={styles.title}>우리 복지관에{'\n'}오신 걸 환영해요</Text>
        <Text style={styles.subtitle}>복지관 소식과 프로그램을{'\n'}쉽고 편하게 만나보세요.</Text>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.primaryButton} onPress={handlePressButton} disabled={status === 'loading'}>
          {status !== 'loading' && <Image source={kakaoSymbol} style={styles.primaryButtonIcon} resizeMode="contain" />}
          <Text style={styles.primaryButtonText}>{status === 'loading' ? '로그인 중...' : '카카오로 시작하기'}</Text>
        </Pressable>
        <Text style={styles.caption}>카카오 계정으로 간편하게 시작할 수 있어요</Text>
        {__DEV__ && (
          <Pressable style={styles.devButton} onPress={handlePressDevLoginButton} disabled={status === 'loading'}>
            <Text style={styles.devButtonText}>테스트 계정으로 로그인 (개발용)</Text>
          </Pressable>
        )}
        {status === 'error' && <Text style={styles.errorText}>로그인에 실패했습니다</Text>}
      </View>
    </SafeAreaView>
  );
};

const authStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.brownTint,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 24,
      paddingTop: 12,
    },
    headerWordmark: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.actionBg,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    illust: {
      width: 240,
      height: 208,
    },
    tagline: {
      fontSize: fontSize('md'),
      fontFamily: fontFamily('bold'),
      color: semantic.urgent,
      marginTop: 22,
    },
    title: {
      fontSize: fontSize('display'),
      fontFamily: fontFamily('bold'),
      lineHeight: fontSize('display') * 1.3,
      textAlign: 'center',
      marginTop: 8,
      color: semantic.textPrimary,
    },
    subtitle: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('semibold'),
      lineHeight: fontSize('lg') * 1.6,
      textAlign: 'center',
      marginTop: 14,
      color: semantic.textSecondary,
    },
    buttonGroup: {
      paddingHorizontal: 20,
      paddingBottom: 28,
      gap: 12,
    },
    primaryButton: {
      flexDirection: 'row',
      gap: 12,
      minHeight: 80,
      borderRadius: 20,
      backgroundColor: KAKAO_YELLOW,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#c9a821',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 18,
      elevation: 4,
    },
    primaryButtonIcon: {
      width: 26,
      height: 28,
    },
    primaryButtonText: {
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      color: KAKAO_TEXT,
    },
    caption: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: semantic.textSecondary,
      textAlign: 'center',
    },
    devButton: {
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileButton,
      borderWidth: 1,
      borderColor: semantic.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    devButtonText: {
      fontSize: fontSize('md'),
      fontFamily: fontFamily('semibold'),
      color: semantic.textSecondary,
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
