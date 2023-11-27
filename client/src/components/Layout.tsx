import { Box, Center, useBreakpointValue } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Center h="100vh" w="100vw">
      <Box
        p="46"
        w="390px"
        h={isMobile ? "100vh" : "800px"}
        style={
          !isMobile
            ? {
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
              }
            : {}
        }
      >
        {children}
      </Box>
    </Center>
  );
};

export default Layout;
