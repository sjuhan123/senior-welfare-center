import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box p="30px 0px">
      <Flex
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap="10px"
      >
        <Box display="flex" flexDirection="row" gap="10px">
          <Heading fontSize="36px" fontWeight="900">
            노인복지관
          </Heading>
          <Box p="10px 0px">
            <Image
              src="https://user-images.githubusercontent.com/81420856/285219033-fb2e1d24-1432-43a6-bcc3-86978058a745.png"
              alt="logo"
              w="30px"
              h="30px"
            />
          </Box>
        </Box>
        <Text fontSize="11px" fontWeight="600">
          서울특별시 공식 홈페이지 데이터를 기반으로 합니다.
        </Text>
      </Flex>
    </Box>
  );
};

export default Header;
