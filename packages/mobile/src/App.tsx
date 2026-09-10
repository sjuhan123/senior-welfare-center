import { useState } from 'react';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routers from './router';
import { FONT_ASSETS } from './constant/fonts';

const App = () => {
  const [fontsLoaded] = useFonts(FONT_ASSETS);
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Routers />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
