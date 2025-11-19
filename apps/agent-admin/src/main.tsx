import '@meaku/core/lib/polyfills';
import '@breakout/design-system/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConversationDetailsProvider } from './context/ConversationDetailsContext.tsx';
import App from './App.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import './lib/sentry.ts';
import { defaultQueryClient } from '@meaku/core/queries/defaultQueryClient';
import { initializeAdminApiClient } from '@meaku/core/adminHttp/index';
import useSessionStore from './stores/useSessionStore/useSessionStore';

// Initialize the admin API client with Zustand token provider
initializeAdminApiClient({
  getAccessToken: () => useSessionStore.getState().accessToken,
  getRefreshToken: () => useSessionStore.getState().refreshToken,
  setAccessToken: (token: string) => {
    const { refreshToken, setTokens } = useSessionStore.getState();
    setTokens(token, refreshToken || '');
  },
  removeAccessToken: () => useSessionStore.setState({ accessToken: null }),
  removeRefreshToken: () => useSessionStore.setState({ refreshToken: null }),
  getTenantIdentifier: () => {
    const activeTenant = useSessionStore.getState().activeTenant;
    return activeTenant?.['tenant-name'] ?? null;
  },
  removeTenantIdentifier: () => useSessionStore.setState({ activeTenant: null }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={defaultQueryClient}>
      <ConversationDetailsProvider>
        <App />
      </ConversationDetailsProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  </StrictMode>,
);
