import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { WelfareData } from "../../../types/welfare";

interface WelfareCenterCardProps {
  center: WelfareData;
  onDelete: (center: WelfareData) => void;
}

const WelfareBookMarkCard = ({ center, onDelete }: WelfareCenterCardProps) => {
  const { district, name, address, phone, remarks } = center;

  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      p="3"
    >
      <Flex justify="flex-between" align="center" w="100%">
        <Text fontSize="l" fontWeight="bold">
          {name}
        </Text>
        <IconButton
          icon={<DeleteIcon />}
          size="sm"
          onClick={() => onDelete(center)}
          aria-label="Delete"
        />
      </Flex>
      <Box>
        <Text fontSize="small">
          {address}, {district.name}
        </Text>
        <Text fontSize="small">전화번호: {phone}</Text>
        {remarks && (
          <Text fontSize="small" fontStyle="italic" color="gray.500">
            {remarks}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default WelfareBookMarkCard;
