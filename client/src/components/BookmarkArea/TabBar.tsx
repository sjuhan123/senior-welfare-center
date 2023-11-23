import { RiAccountPinCircleFill } from "react-icons/ri";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { Box, Icon, Text } from "@chakra-ui/react";
import { CgCloseO } from "react-icons/cg";
import { UserResponse } from "../../types/user";

interface TabBarProps {
  isAtHome: boolean;
  isOnBookmark: true | UserResponse | undefined;
  isOnLogin: UserResponse | undefined;
  handleBookmarkArea: () => void;
}

const TabBar = ({
  isAtHome,
  isOnBookmark,
  isOnLogin,
  handleBookmarkArea,
}: TabBarProps) => {
  return (
    <>
      {isAtHome && <Icon as={RiAccountPinCircleFill} w={6} h={6} />}
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
            <Text fontSize="md" fontWeight="bold">
              복지관 저장소
            </Text>
          </Box>
          {!isOnLogin && (
            <Box display="flex" alignItems="center">
              <Icon as={CgCloseO} w={4} h={4} onClick={handleBookmarkArea} />
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default TabBar;
