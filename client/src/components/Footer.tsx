import { EmailIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      as="footer"
      position="fixed"
      bottom="0"
      left="0"
      width="100%"
      textAlign="center"
      paddingY="2"
    >
      <EmailIcon boxSize={4} />
    </Box>
  );
};

export default Footer;
