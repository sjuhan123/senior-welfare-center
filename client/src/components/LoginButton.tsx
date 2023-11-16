import { Button, Text } from "@chakra-ui/react";
import { KakaoLogo } from "../assets";

const LoginButton = () => {
  return (
    <Button
      leftIcon={<KakaoLogo />}
      h="45px"
      w="100%"
      bg="#FEE500"
      variant="solid"
      mt="20px"
    >
      <Text ml="10px">카카오톡 로그인</Text>
    </Button>
  );
};

export default LoginButton;
