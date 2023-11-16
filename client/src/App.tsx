import { QueryClient, QueryClientProvider } from "react-query";
import Routers from "./router";
import { CSSReset, ChakraProvider } from "@chakra-ui/react";
import theme from "./styles/theme";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <QueryClientProvider client={queryClient}>
        <Routers />
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
