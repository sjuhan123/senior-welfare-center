import { Button, Text } from "@chakra-ui/react";

interface NavButtonProps {
  fLine: string;
  sLine: string;
}

const NavButton = ({ fLine, sLine }: NavButtonProps) => {
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
    >
      <Text fontSize="24px" fontWeight="900">
        {fLine}
      </Text>
      <Text fontSize="18px" fontWeight="900">
        {sLine}
      </Text>
    </Button>
  );
};

export default NavButton;
