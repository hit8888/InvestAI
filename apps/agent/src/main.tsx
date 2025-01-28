import '@breakout/design-system/styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { defaultQueryClient } from '@meaku/core/queries/defaultQueryClient';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/sentry.ts';
import './styles/custom.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={defaultQueryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
