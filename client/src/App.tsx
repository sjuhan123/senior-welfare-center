import { QueryClient, QueryClientProvider } from "react-query";
import Routers from "./router";
import { CSSReset, ChakraProvider } from "@chakra-ui/react";
import theme from "./styles/theme";
import { BookmarkListProvider } from "./contexts/bookmarkContext";
import { UserKakaoInfoProvider } from "./contexts/userKakaoInfoContext";
import useScreenSizeEffect from "./hooks/useScreenSize";

const App = () => {
  const queryClient = new QueryClient();
  useScreenSizeEffect();

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <QueryClientProvider client={queryClient}>
        <UserKakaoInfoProvider>
          <BookmarkListProvider>
            <Routers />
          </BookmarkListProvider>
        </UserKakaoInfoProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
