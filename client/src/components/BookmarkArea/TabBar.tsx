import { RiAccountPinCircleFill } from "react-icons/ri";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { Box, Icon, Text } from "@chakra-ui/react";
import { CgCloseO } from "react-icons/cg";

interface TabBarProps {
  isAtHome: boolean;
  isOnBookmark: string | null | true;
  isOnLogin: string | null;
  handleBookmarkArea: () => void;
}

const TabBar = ({
  isAtHome,
  isOnBookmark,
  isOnLogin,
  handleBookmarkArea,
}: TabBarProps) => {
  return (
    <Box
      as="div"
      display="flex"
      flexDir="row"
      gap={2}
      alignItems="center"
      p="0px 0px 20px 0px"
      align-items="flex-end"
    >
      {isAtHome && (
        <>
          <Icon as={RiAccountPinCircleFill} w={6} h={6} />
          <Text fontSize="md" fontWeight="bold">
            로그인
          </Text>
        </>
      )}

      {isOnBookmark && (
        <Box
          display="flex"
          flexDir="row"
          justifyContent="space-between"
          w="100%"
        >
          <Box display="flex" flexDir="row" gap={2}>
            <Icon
              as={BsBookmarkHeartFill}
              w={6}
              h={6}
              onClick={handleBookmarkArea}
            />
            {!isAtHome && (
              <Text fontSize="md" fontWeight="bold">
                복지관 보관소
              </Text>
            )}
          </Box>
          {!isOnLogin && (
            <Box display="flex" alignItems="center">
              <Icon as={CgCloseO} w={4} h={4} onClick={handleBookmarkArea} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TabBar;
