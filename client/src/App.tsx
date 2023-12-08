import { QueryClient, QueryClientProvider } from "react-query";
import Routers from "./router";
import { CSSReset, ChakraProvider } from "@chakra-ui/react";
import theme from "./styles/theme";
import { UserKakaoInfoProvider } from "./contexts/userKakaoInfoContext";
import useScreenSizeEffect from "./hooks/screen/useScreenSize";
import { useState } from "react";

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  useScreenSizeEffect();

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <QueryClientProvider client={queryClient}>
        <UserKakaoInfoProvider>
          <Routers />
        </UserKakaoInfoProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
