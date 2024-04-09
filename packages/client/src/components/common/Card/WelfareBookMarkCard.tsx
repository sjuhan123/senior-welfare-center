import {
  Box,
  Text,
  IconButton,
  Icon,
  HStack,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { WelfareData } from '../../../types/welfare';
import { FaPaste } from 'react-icons/fa';
import { handleCopyClipBoard, handlePhoneClick } from '../../../utills/card';

interface WelfareCenterCardProps {
  center: WelfareData;
  onDelete: (center: WelfareData) => void;
}

const WelfareBookMarkCard = ({ center, onDelete }: WelfareCenterCardProps) => {
  const toast = useToast();
  const { district, name, address, phone, homepage } = center;

  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      p="3"
    >
      <VStack justify="space-between" align="start" w="100%">
        <HStack spacing="10px" justify="space-between" w="100%">
          <Text fontSize="l" fontWeight="bold">
            {name}
          </Text>
          <IconButton
            icon={<DeleteIcon />}
            size="sm"
            onClick={() => onDelete(center)}
            aria-label="Delete"
          />
        </HStack>
        <VStack spacing="2px" align="flex-start">
          <Text fontSize="small">
            홈페이지:
            <Text
              as="span"
              color="blue.500"
              ml="5px"
              cursor="pointer"
              onClick={() => window.open(homepage, '_blank')}
            >
              방문하기
            </Text>
          </Text>
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
                // TODO: eslint error 해결하기
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                handleCopyClipBoard(address);
                toast({
                  title: '복사 완료',
                  description: '주소가 복사되었습니다.',
                  status: 'success',
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
                  title: '복사 완료',
                  description: '전화번호가 복사되었습니다.',
                  status: 'success',
                  duration: 1000,
                  isClosable: true,
                });
              }}
            />
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default WelfareBookMarkCard;
