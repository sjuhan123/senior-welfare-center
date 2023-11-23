import { Button, Text } from "@chakra-ui/react";
import { KakaoLogo } from "../../../assets";

interface LoginButtonProps {
  onLogin: () => void;
}

const LoginButton = ({ onLogin }: LoginButtonProps) => {
  return (
    <Button
      leftIcon={<KakaoLogo />}
      h="45px"
      w="100%"
      bg="#FEE500"
      variant="solid"
      onClick={() => onLogin()}
    >
      <Text ml="10px">카카오 로그인</Text>
    </Button>
  );
};

export default LoginButton;
