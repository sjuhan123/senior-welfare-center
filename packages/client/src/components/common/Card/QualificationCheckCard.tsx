import { Box, Button, Text } from '@chakra-ui/react';

interface QualificationCheckCardProps {
  onClick: () => void;
}

const QualificationCheckCard = ({ onClick }: QualificationCheckCardProps) => {
  return (
    <Box
      height="100%"
      width="100%"
      bg="gray.300"
      borderRadius="5px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="5px"
    >
      <Text fontSize="11px" fontWeight="600">
        서울시 노인복지관
      </Text>
      <Text fontSize="11px" fontWeight="600">
        이용이 가능하십니다.
      </Text>
      <Button variant="solid" colorScheme="teal" size="xs" onClick={onClick}>
        자격 확인 다시하기
      </Button>
    </Box>
  );
};

export default QualificationCheckCard;
