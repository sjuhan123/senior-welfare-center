import { EmailIcon } from '@chakra-ui/icons';
import { Box, HStack, Text, useBreakpointValue } from '@chakra-ui/react';

const Footer = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="footer"
      w="298px"
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
              top: 'calc(100vh - ((100vh - 500px) / 2) + 140px)',
            }
          : {
              bottom: '0',
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
