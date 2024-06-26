import { SunIcon } from '@chakra-ui/icons';
import { Button, Text, useToast } from '@chakra-ui/react';

const EmployeeLoginButton = () => {
  const toast = useToast();

  return (
    <Button
      leftIcon={<SunIcon />}
      h="45px"
      w="100%"
      bg="#7bde94"
      variant="solid"
      onClick={() =>
        toast({
          title: '서비스 준비중입니다.',
          status: 'info',
          duration: 1000,
          isClosable: true,
        })
      }
    >
      <Text ml="10px">복지관 로그인</Text>
    </Button>
  );
};

export default EmployeeLoginButton;
