import '@breakout/design-system/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthProvider.tsx';
import { SidebarProvider } from './context/SidebarContext.tsx';
import { ConversationDetailsProvider } from './context/ConversationDetailsContext.tsx';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import './lib/sentry.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <ConversationDetailsProvider>
            <App />
          </ConversationDetailsProvider>
        </SidebarProvider>
      </AuthProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>,
);
