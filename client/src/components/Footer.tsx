import { EmailIcon } from "@chakra-ui/icons";
import { Box, HStack, Text, useBreakpointValue } from "@chakra-ui/react";

const Footer = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="footer"
      w={isMobile ? "calc(100vw - 92px)" : "406px"}
      textAlign="center"
      paddingY="2"
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDir="column"
      position="fixed"
      bottom={isMobile ? "0" : "140"}
      gap="1"
    >
      <HStack spacing="1">
        <EmailIcon boxSize={4} />
        <Text fontSize="xs" fontWeight="bold" ml="1">
          den.sjuhan.dev@gmail.com
        </Text>
      </HStack>
      <Text fontSize="xs" fontWeight="bold" ml="1">
        2023. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
