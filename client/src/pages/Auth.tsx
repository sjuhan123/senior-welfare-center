import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useBookmarkListContext } from "../contexts/bookmarkContext";
import LoadingIndicator from "../components/common/LoadingIndicator";
import Layout from "../components/common/Layout";

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
