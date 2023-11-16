import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box p="100px 0px">
      <Flex
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap="10px"
      >
        <Heading as="h1" fontSize="36px" fontWeight="900">
          서울시
        </Heading>
        <Heading as="h1" fontSize="36px" fontWeight="900">
          노인복지관 찾기
        </Heading>
        <Text fontSize="11px" fontWeight="600">
          서울특별시 공식 홈페이지 기반 데이터입니다.
        </Text>
      </Flex>
    </Box>
  );
};

export default Header;
