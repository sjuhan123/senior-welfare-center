import { QueryClient, QueryClientProvider } from 'react-query';
import Routers from './router';
import { CSSReset, ChakraProvider } from '@chakra-ui/react';
import theme from './styles/theme';
import useScreenSizeEffect from './hooks/screen/useScreenSize';
import { useState } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ThemeProvider } from '@emotion/react';
import { defaultTheme } from '@common/shared';

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
      }),
  );
  useScreenSizeEffect();

  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider theme={defaultTheme}>
        <ErrorBoundary>
          <CSSReset />
          <QueryClientProvider client={queryClient}>
            <Routers />
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
