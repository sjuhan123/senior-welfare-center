import { Button } from '@chakra-ui/react';

interface ToButtonProps {
  leftIcon: React.ReactElement;
  bg: string;
  onClick: () => void;
  text: string;
}

const ToButton = ({ leftIcon, bg, onClick, text }: ToButtonProps) => {
  return (
    <Button
      leftIcon={leftIcon}
      variant="solid"
      bg={bg}
      onClick={onClick}
      size="xs"
    >
      {text}
    </Button>
  );
};

export default ToButton;
