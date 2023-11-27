import { EmailIcon } from "@chakra-ui/icons";
import { Box, HStack, Text, useBreakpointValue } from "@chakra-ui/react";

const Footer = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="footer"
      w={isMobile ? "calc(100vw - 92px)" : "296px"}
      textAlign="center"
      paddingY="2"
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDir="column"
      position="fixed"
      gap="1"
      style={
        !isMobile
          ? {
              top: "calc(100vh - ((100vh - 500px) / 2) + 90px)",
            }
          : {
              bottom: "0",
            }
      }
    >
      <HStack spacing="1">
        <EmailIcon boxSize={4} />
        <Text fontSize="xs" fontWeight="bold" ml="1">
          den.sjuhan.dev@gmail.com
        </Text>
      </HStack>
    </Box>
  );
};

export default Footer;
