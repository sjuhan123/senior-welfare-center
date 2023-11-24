import { Box, Text, Icon } from "@chakra-ui/react";
import { FaRegBookmark } from "react-icons/fa";

const BookmarkableCard = () => {
  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      p="3"
      display="flex"
      h="97px"
      alignItems="center"
      justifyContent="center"
      gap="10px"
    >
      <Icon as={FaRegBookmark} w={4} h={4} />
      <Text fontSize="sm" fontWeight="bold">
        복지관 보관자리
      </Text>
    </Box>
  );
};

export default BookmarkableCard;
