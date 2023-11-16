import { Box, Center } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Center h="100vh" w="100vw">
      <Box p="46" w="100%" maxW="1200px" h="100%">
        {children}
      </Box>
    </Center>
  );
};

export default Layout;
