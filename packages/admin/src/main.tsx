import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

import './index.css';
import App from './App';
import theme from './styles/theme';

Sentry.init({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: !import.meta.env.DEV,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? 'development',
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
