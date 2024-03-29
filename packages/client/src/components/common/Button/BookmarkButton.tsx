import { Button, Icon, Text } from '@chakra-ui/react';
import { FaRegBookmark } from 'react-icons/fa';

interface BookmarkButtonProps {
  onClick: () => void;
}

const BookmarkButton = ({ onClick }: BookmarkButtonProps) => {
  return (
    <Button
      leftIcon={<Icon as={FaRegBookmark} w={4} h={4} />}
      h="45px"
      w="100%"
      bg="#f0c74b"
      variant="solid"
      onClick={onClick}
    >
      <Text ml="10px">복지관 보관소</Text>
    </Button>
  );
};

export default BookmarkButton;
