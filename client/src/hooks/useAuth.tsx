import { useQuery, useQueryClient } from "react-query";
import { UserResponse } from "../types/user";
import {
  clearUserToken,
  getUserToken,
  setUserToken,
} from "../utills/persistentStorage";

async function getToken(code?: string) {
  const response = await fetch(
    `https://localhost:8000/api/auth/kakao?code=${code}`
  );
  const { data } = await response.json();
  return data;
}

async function getUserInfo(token: string) {
  const response = await fetch("https://localhost:8000/api/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

interface UseAuth {
  userInfo: UserResponse | null;
  logout: () => Promise<void>;
}

const useAuth = (code?: string): UseAuth => {
  const queryClient = useQueryClient();

  const { data: token } = useQuery(["token", code], () => getToken(code), {
    enabled: !!code,
    onSuccess: (receivedToken) => {
      setUserToken(receivedToken);
      queryClient.setQueryData("token", receivedToken);
    },
  });

  const { data: userInfo } = useQuery(
    ["userInfo", token],
    () => getUserInfo(token),
    {
      enabled: !!token,
      onSuccess: (receivedUserInfo) => {
        queryClient.setQueryData("userInfo", receivedUserInfo);
      },
    }
  );

  const logout = async () => {
    try {
      const token = getUserToken();

      if (token) {
        await fetch("https://localhost:8000/api/user/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        clearUserToken();
        queryClient.setQueryData("token", null);
        queryClient.setQueryData("userInfo", null);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return { userInfo, logout };
};

export default useAuth;
