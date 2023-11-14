import { QueryClient, QueryClientProvider } from "react-query";
import Routers from "./router";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routers />
    </QueryClientProvider>
  );
};

export default App;
