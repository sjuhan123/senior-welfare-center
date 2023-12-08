import { useQuery, useQueryClient } from "react-query";
import { UserResponse } from "../types/user";
import {
  clearUserToken,
  getUserToken,
  setUserToken,
} from "../utills/persistentStorage";
import { END_POINT } from "../constant/endpoint";
import { QUERY_KEYS } from "../constant/queryKeys";
import { useUserKakaoInfoContext } from "../contexts/userKakaoInfoContext";

async function getToken(code?: string) {
  const response = await fetch(`${END_POINT.KAKAO_LOGIN}?code=${code}`);
  const { data } = await response.json();
  return data;
}

async function getUserInfo(token: string) {
  const response = await fetch(END_POINT.USER, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

interface UseKakaoLogin {
  userInfo: UserResponse | undefined;
  login: () => void;
  logout: () => Promise<void>;
}

const useKakaoLogin = (code?: string): UseKakaoLogin => {
  const queryClient = useQueryClient();
  const { updateUserKakaoInfo } = useUserKakaoInfoContext();

  const { data: token } = useQuery(
    [QUERY_KEYS.TOKEN, code],
    () => getToken(code),
    {
      enabled: !!code,
      onSuccess: (receivedToken) => {
        setUserToken(receivedToken);
      },
    }
  );

  const { data: userInfo } = useQuery(
    [QUERY_KEYS.USER_INFO, token],
    () => getUserInfo(token),
    {
      enabled: !!token,
      onSuccess: (receivedUserInfo: UserResponse) => {
        updateUserKakaoInfo({
          userName: receivedUserInfo.data.userName,
          userAvatar: receivedUserInfo.data.userAvatar,
        });
      },
    }
  );

  const login = () => {
    const kakaoLogin = `https://kauth.kakao.com/oauth/authorize?client_id=${
      import.meta.env.VITE_KAKAO_API_KEY
    }&redirect_uri=${
      import.meta.env.VITE_KAKAO_REDIRECT_URI
    }&response_type=code`;

    window.location.href = kakaoLogin;
  };

  const logout = async () => {
    try {
      const token = getUserToken();

      if (token) {
        await fetch(END_POINT.KAKAO_LOGOUT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        clearUserToken();
        queryClient.setQueryData(QUERY_KEYS.USER_INFO, null);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return { userInfo, login, logout };
};

export default useKakaoLogin;
