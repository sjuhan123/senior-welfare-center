import { Box, Center, useBreakpointValue } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Center h="calc(var(--vh, 1vh) * 100)" w="100%">
      <Box
        p="46"
        w="390px"
        h={isMobile ? "calc(var(--vh, 1vh) * 100)" : "850"}
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
