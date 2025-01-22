import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { beforeAll, afterAll, vi } from 'vitest';

// Create a custom render function that includes providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

function customRender(
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...options }: CustomRenderOptions = {},
) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options }),
  };
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Helper functions
export const waitForLoadingToFinish = () => new Promise((resolve) => setTimeout(resolve, 0));

export const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

// Common test data
export const mockData = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  },
};

// Common test utilities
export const mockConsoleError = () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });
};
