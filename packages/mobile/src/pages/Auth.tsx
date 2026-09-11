import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSetAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import useKakaoLogin from '../hooks/auth/useKakaoLogin';
import { postAuthKakao } from '../hooks/api/auth/usePostAuthKakao';
import { getUserInfo } from '../hooks/api/auth/useGetUserInfo';
import { getMemberships } from '../hooks/api/membership/useGetMemberships';
import { setUserToken, setRefreshToken } from '../utills/persistentStorage';
import { isUserTokenValidAtom } from '../store/auth';
import { userInfoAtom } from '../store/user';
import useStyles from '../hooks/styles/useStyles';
import type { RootStackParamList } from '../router';

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

  const styles = useStyles(({ fontSize, fontFamily }) =>
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
        backgroundColor: color.navy,
        alignItems: 'center',
        justifyContent: 'center',
      },
      logoText: {
        fontSize: fontSize('lg'),
        fontFamily: fontFamily('bold'),
        color: semantic.textOnDark,
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
        backgroundColor: semantic.ctaBg,
        alignItems: 'center',
        justifyContent: 'center',
      },
      primaryButtonText: {
        fontSize: fontSize('xxl'),
        fontFamily: fontFamily('bold'),
        color: semantic.ctaFg,
      },
      secondaryButton: {
        minHeight: hit.mobileMin,
        borderWidth: 1.5,
        borderColor: color.grey400,
        borderRadius: radius.mobileButton,
        backgroundColor: color.grey0,
        alignItems: 'center',
        justifyContent: 'center',
      },
      secondaryButtonText: {
        fontSize: fontSize('lg'),
        fontFamily: fontFamily('semibold'),
        color: color.grey800,
      },
      errorText: {
        fontSize: fontSize('sm'),
        fontFamily: fontFamily('regular'),
        color: semantic.stateStopFg,
        textAlign: 'center',
        marginTop: 8,
      },
    }),
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>복지</Text>
        </View>
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
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>어려우면 복지관에 전화</Text>
        </Pressable>
        {status === 'error' && <Text style={styles.errorText}>로그인에 실패했습니다</Text>}
      </View>
    </View>
  );
};

export default Auth;
