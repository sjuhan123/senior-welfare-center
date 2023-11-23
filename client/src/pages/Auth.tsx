import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";

const Auth = () => {
  const navigate = useNavigate();

  const url = new URL(window.location.href);
  const queryCode = url.searchParams.get("code") || "";

  const { userInfo } = useAuth(queryCode);

  useEffect(() => {
    if (userInfo && userInfo.message === "유저 정보 조회 성공") {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
      width="100vw"
      position="fixed"
      top="0"
      left="0"
    >
      <Box>
        <Spinner size="xl" color="blue.500" />
      </Box>
    </Flex>
  );
};

export default Auth;
