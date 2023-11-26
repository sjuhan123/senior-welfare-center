import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { useBookmarkListContext } from "../contexts/bookmarkContext";
import LoadingIndicator from "../components/common/LoadingIndicator";

const Auth = () => {
  const navigate = useNavigate();
  const { updateBookmarkList } = useBookmarkListContext();

  const url = new URL(window.location.href);
  const queryCode = url.searchParams.get("code") || "";

  const { userInfo } = useAuth(queryCode);

  useEffect(() => {
    if (userInfo && userInfo.message === "유저 정보 조회 성공") {
      updateBookmarkList(userInfo.data.bookmarkWelfares);
      navigate("/");
    }
  }, [navigate, updateBookmarkList, userInfo]);

  return (
    <Flex align="center" justify="center" height="100vh" width="100vw">
      <LoadingIndicator fLine="로그인 중입니다" sLine="잠시만 기다려주세요" />
    </Flex>
  );
};

export default Auth;
