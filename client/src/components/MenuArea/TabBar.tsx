import { Box, Icon, Text } from "@chakra-ui/react";
import { FaHouseUser } from "react-icons/fa";
import { CgCloseO } from "react-icons/cg";

interface TabBarProps {
  onClick: () => void;
  isQualificationCheckerClicked: boolean;
  isCenterListClicked: boolean;
}

const TabBar = ({
  onClick,
  isQualificationCheckerClicked,
  isCenterListClicked,
}: TabBarProps) => {
  const isAtHome = !isQualificationCheckerClicked && !isCenterListClicked;

  return (
    <Box
      as="div"
      display="flex"
      flexDir="row"
      gap={2}
      alignItems="center"
      p="0px 0px 10px 0px"
      align-items="flex-end"
    >
      <Icon as={FaHouseUser} w={6} h={6} onClick={onClick} />
      <Box display="flex" flexDir="row" justifyContent="space-between" w="100%">
        {isAtHome && (
          <Text fontSize="md" fontWeight="bold">
            메뉴
          </Text>
        )}
        {isQualificationCheckerClicked && (
          <Text fontSize="md" fontWeight="bold">
            복지관 자격 조회
          </Text>
        )}
        {isCenterListClicked && (
          <Text fontSize="md" fontWeight="bold">
            복지관 목록 보기
          </Text>
        )}
        {!isAtHome && (
          <Box display="flex" alignItems="center">
            <Icon as={CgCloseO} w={4} h={4} onClick={onClick} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TabBar;
