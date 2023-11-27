import { Box, Text, Flex, IconButton, Icon, HStack } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { WelfareData } from "../../../types/welfare";
import { FaPaste } from "react-icons/fa";
import { handleCopyClipBoard, handlePhoneClick } from "../../../utills/card";

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
      <Flex justify="space-between" align="center" w="100%">
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
        <HStack spacing="3px">
          <Text fontSize="small">
            주소: {address}, {district.name}
          </Text>
          <Icon
            as={FaPaste}
            w={3}
            h={3}
            cursor="pointer"
            onClick={() => handleCopyClipBoard(address)}
          />
        </HStack>
        <HStack spacing="3px">
          <Text fontSize="small">
            전화번호:
            <Text
              as="span"
              color="blue.500"
              onClick={() => handlePhoneClick(phone)}
              ml="5px"
              textDecoration="underline"
              cursor="pointer"
            >
              {phone}
            </Text>
          </Text>
          <Icon
            as={FaPaste}
            w={3}
            h={3}
            cursor="pointer"
            onClick={() => handleCopyClipBoard(phone)}
          />
        </HStack>
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
