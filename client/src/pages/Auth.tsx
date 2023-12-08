import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import LoadingIndicator from "../components/common/LoadingIndicator";
import Layout from "../components/common/Layout";
import { ROUTE_PATH } from "../constant/route";
import useGetTokenByCode from "../hooks/api/useGetTokenByCode";
import { setUserToken } from "../utills/persistentStorage";
import useGetUserInfo from "../hooks/api/useGetUserInfo";
import { useUserKakaoInfoContext } from "../contexts/userKakaoInfoContext";
import { useSetAtom } from "jotai";
import { isUserTokenValidAtom } from "../store/auth";
import { bookmarkListAtom } from "../store/bookmarkList";

const Auth = () => {
  const navigate = useNavigate();
  const setIsUserTokenValid = useSetAtom(isUserTokenValidAtom);
  const updateBookmarkList = useSetAtom(bookmarkListAtom);
  const { updateUserKakaoInfo } = useUserKakaoInfoContext();

  const url = new URL(window.location.href);
  const queryCode = url.searchParams.get("code") || "";

  const { data } = useGetTokenByCode(queryCode, {
    enabled: !!queryCode,
    onSuccess: (receivedToken) => {
      setIsUserTokenValid(true);
      setUserToken(receivedToken.data);
    },
  });

  const { data: userInfo } = useGetUserInfo({
    enabled: !!data,
    onSuccess: (receivedUserInfo) => {
      updateUserKakaoInfo({
        userName: receivedUserInfo.data.userName,
        userAvatar: receivedUserInfo.data.userAvatar,
      });
      updateBookmarkList(receivedUserInfo.data.bookmarkWelfares);
    },
  });

  useEffect(() => {
    if (userInfo && userInfo.message === "유저 정보 조회 성공") {
      navigate(ROUTE_PATH.HOME);
    }
  }, [navigate, userInfo]);

  return (
    <Layout>
      <Box
        as="div"
        w="100%"
        h="100%"
        display="flex"
        justifyContent="center"
        ml="10"
      >
        <LoadingIndicator fLine="로그인 중입니다" sLine="잠시만 기다려주세요" />
      </Box>
    </Layout>
  );
};

export default Auth;
