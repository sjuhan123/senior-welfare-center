import { Box, Text, Flex, IconButton, Icon } from "@chakra-ui/react";
import { WelfareData } from "../../../types/welfare";
import { FaRegBookmark } from "react-icons/fa";

interface WelfareCardProps {
  center: WelfareData;
  onBookmark: () => void;
}

const WelfareCard = ({ center, onBookmark }: WelfareCardProps) => {
  const { district, name, address, phone, remarks } = center;

  return (
    <Box overflow="hidden" p="3" w="100%">
      <Flex justify="space-between" align="center" w="100%" mb="6">
        <Text fontSize="l" fontWeight="bold">
          {name}
        </Text>
        <IconButton
          icon={<Icon as={FaRegBookmark} w={4} h={4} />}
          size="sm"
          onClick={() => onBookmark()}
          aria-label="Bookmark"
        />
      </Flex>
      <Box>
        <Text fontSize="small">홈페이지:</Text>
        <Text fontSize="small">
          {address}, {district.name}
        </Text>
        <Text fontSize="small">전화번호: {phone}</Text>
        {remarks && (
          <Text fontSize="small" fontStyle="italic" color="gray.500">
            비고: {remarks}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default WelfareCard;
