import '@meaku/core/lib/polyfills';
import '@breakout/design-system/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthProvider.tsx';
import { ConversationDetailsProvider } from './context/ConversationDetailsContext.tsx';
import App from './App.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import './lib/sentry.ts';
import { defaultQueryClient } from '@meaku/core/queries/defaultQueryClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={defaultQueryClient}>
      <AuthProvider>
        <ConversationDetailsProvider>
          <App />
        </ConversationDetailsProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
