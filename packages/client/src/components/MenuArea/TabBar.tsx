import { Box, Icon, Text } from '@chakra-ui/react';
import { FaHouseUser } from 'react-icons/fa';

const TabBar = () => {
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
      <Icon as={FaHouseUser} w={6} h={6} />
      <Box display="flex" flexDir="row" justifyContent="space-between" w="100%">
        <Text fontSize="md" fontWeight="bold">
          복지관 메뉴
        </Text>
      </Box>
    </Box>
  );
};

export default TabBar;
