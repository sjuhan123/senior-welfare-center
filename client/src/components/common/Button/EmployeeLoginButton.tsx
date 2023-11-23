import { SunIcon } from "@chakra-ui/icons";
import { Button, Text } from "@chakra-ui/react";

const EmployeeLoginButton = () => {
  return (
    <Button
      leftIcon={<SunIcon />}
      h="45px"
      w="100%"
      bg="#7bde94"
      variant="solid"
    >
      <Text ml="10px">복지관 로그인</Text>
    </Button>
  );
};

export default EmployeeLoginButton;
