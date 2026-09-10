import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import { useAtom, useSetAtom } from 'jotai';
import { isUserTokenValidAtom } from '../../store/auth';
import { post } from '../../libs/api';
import { END_POINT } from '../../constant/endpoint';
import { resetUserInfoAtom } from '../../store/user';
import { clearUserToken, clearRefreshToken } from '../../utills/persistentStorage';

type UseKakaoLogin = {
  login: () => Promise<string | null>;
  logout: () => Promise<void>;
};

const useKakaoLogin = (): UseKakaoLogin => {
  const [isUserTokenValid, setIsUserTokenValid] = useAtom(isUserTokenValidAtom);
  const resetUserInfo = useSetAtom(resetUserInfoAtom);

  const login = async () => {
    try {
      const { accessToken } = await kakaoLogin();
      return accessToken;
    } catch (error) {
      console.error('카카오 로그인 실패', error);
      return null;
    }
  };

  const logout = async () => {
    if (isUserTokenValid) {
      await post(END_POINT.KAKAO_LOGOUT);
    }
    setIsUserTokenValid(false);
    resetUserInfo();
    await clearUserToken();
    await clearRefreshToken();
  };

  return { login, logout };
};

export default useKakaoLogin;
