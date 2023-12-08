import { clearUserToken } from "../../utills/persistentStorage";
import { useAtom } from "jotai";
import { isUserTokenValidAtom } from "../../store/auth";
import { post } from "../../libs/api";
import { END_POINT } from "../../constant/endpoint";

type UseKakaoLogin = {
  login: () => void;
  logout: () => Promise<void>;
};

const useKakaoLogin = (): UseKakaoLogin => {
  const [isUserTokenValid, setIsUserTokenValid] = useAtom(isUserTokenValidAtom);

  const login = () => {
    const kakaoLogin = `https://kauth.kakao.com/oauth/authorize?client_id=${
      import.meta.env.VITE_KAKAO_API_KEY
    }&redirect_uri=${
      import.meta.env.VITE_KAKAO_REDIRECT_URI
    }&response_type=code`;

    window.location.href = kakaoLogin;
  };

  const logout = async () => {
    if (isUserTokenValid) {
      await post(END_POINT.KAKAO_LOGOUT);
    }
    setIsUserTokenValid(false);
    clearUserToken();
  };

  return { login, logout };
};

export default useKakaoLogin;
