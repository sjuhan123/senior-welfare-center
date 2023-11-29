import { QueryClient, QueryClientProvider } from "react-query";
import Routers from "./router";
import { CSSReset, ChakraProvider } from "@chakra-ui/react";
import theme from "./styles/theme";
import { BookmarkListProvider } from "./contexts/bookmarkContext";
import { useEffect } from "react";

const App = () => {
  const queryClient = new QueryClient();

  function setScreenSize() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    setScreenSize();
    window.addEventListener("resize", setScreenSize);

    return () => {
      window.removeEventListener("resize", setScreenSize);
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <QueryClientProvider client={queryClient}>
        <BookmarkListProvider>
          <Routers />
        </BookmarkListProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;