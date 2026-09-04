import { Center, VStack } from '@chakra-ui/react';

const ErrorFallback = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <Center h="100vh" as="main">
      <VStack>
        <VStack>
          <h1>알 수 없는 에러가 발생했습니다.</h1>
          <small>에러 메시지: {errorMessage}</small>
        </VStack>

        <VStack>
          <p>문제가 지속되면 아래 이메일로 문의해주세요.</p>
          <a href="mailto:den.sjuhan.dev@gmail.com">den.sjuhan.dev@gmail.com</a>
        </VStack>
      </VStack>
    </Center>
  );
};

export default ErrorFallback;
