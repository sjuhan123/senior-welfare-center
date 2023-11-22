import { Button, Text } from "@chakra-ui/react";

interface NavButtonProps {
  onClick: () => void;
  fLine: string;
  sLine: string;
}

const NavButton = ({ onClick, fLine, sLine }: NavButtonProps) => {
  return (
    <Button
      height="100%"
      width="100%"
      bg="gray.300"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="10px"
      variant="solid"
      onClick={onClick}
    >
      <Text fontSize="21px" fontWeight="900">
        {fLine}
      </Text>
      <Text fontSize="13px" fontWeight="900">
        {sLine}
      </Text>
    </Button>
  );
};

export default NavButton;
