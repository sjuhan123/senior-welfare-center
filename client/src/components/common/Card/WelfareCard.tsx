import {
  Box,
  Text,
  Flex,
  IconButton,
  Icon,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { WelfareData } from "../../../types/welfare";
import { MdBookmarkAdded } from "react-icons/md";
import { FcBookmark } from "react-icons/fc";
import { FaPaste } from "react-icons/fa";
import { handleCopyClipBoard, handlePhoneClick } from "../../../utills/card";

interface WelfareCardProps {
  center: WelfareData;
  isBookmarked: boolean;
  onBookmark: () => void;
}

const WelfareCard = ({
  center,
  isBookmarked,
  onBookmark,
}: WelfareCardProps) => {
  const toast = useToast();
  const { district, name, address, phone, remarks } = center;

  return (
    <Box overflow="hidden" p="3" w="100%">
      <Flex justify="space-between" align="center" w="100%" mb="6">
        <Text fontSize="l" fontWeight="bold">
          {name}
        </Text>
        <IconButton
          icon={
            isBookmarked ? (
              <Icon as={FcBookmark} w={4} h={4} />
            ) : (
              <Icon as={MdBookmarkAdded} w={4} h={4} />
            )
          }
          size="sm"
          onClick={onBookmark}
          aria-label="Bookmark"
        />
      </Flex>
      <Box>
        <Text fontSize="small">홈페이지:</Text>
        <HStack spacing="3px">
          <Text fontSize="small">
            주소: {address}, {district.name}
          </Text>
          <Icon
            as={FaPaste}
            w={3}
            h={3}
            cursor="pointer"
            onClick={() => {
              handleCopyClipBoard(address);
              toast({
                title: "복사 완료",
                description: "주소가 복사되었습니다.",
                status: "success",
                duration: 1000,
                isClosable: true,
              });
            }}
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
            onClick={() => {
              handleCopyClipBoard(phone);
              toast({
                title: "복사 완료",
                description: "전화번호가 복사되었습니다.",
                status: "success",
                duration: 1000,
                isClosable: true,
              });
            }}
          />
        </HStack>
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
