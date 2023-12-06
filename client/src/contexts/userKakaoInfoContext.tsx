/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { UserKakaoInfo } from "../types/user";

interface UserKakaoInfoContextProps {
  userKakaoInfo: UserKakaoInfo;
  updateUserKakaoInfo: (userKakaoInfo: UserKakaoInfo) => void;
}

interface UserProviderProps {
  children: React.ReactNode;
}

export const userKakaoInfoContext =
  createContext<UserKakaoInfoContextProps | null>(null);

export const UserKakaoInfoProvider = ({ children }: UserProviderProps) => {
  const [userKakaoInfo, setUserKakaoInfo] = useState<UserKakaoInfo>({
    userName: "",
    userAvatar: "",
  });

  const updateUserKakaoInfo = (userData: UserKakaoInfo) => {
    setUserKakaoInfo(userData);
  };

  return (
    <userKakaoInfoContext.Provider
      value={{ userKakaoInfo, updateUserKakaoInfo }}
    >
      {children}
    </userKakaoInfoContext.Provider>
  );
};

export const useUserKakaoInfoContext = () => {
  const context = useContext(userKakaoInfoContext);

  if (!context) {
    throw new Error("useUserContext should be used within userContextProvider");
  }

  return context;
};
