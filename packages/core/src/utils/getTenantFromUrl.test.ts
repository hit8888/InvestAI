// getTenantFromUrl.test.ts
import { vi } from 'vitest';

// Mock the env module to prevent validation errors
vi.mock('../types/env', () => ({
  ENV: {
    VITE_BASE_API_URL: 'http://localhost:3000',
    VITE_LOGROCKET_APP_ID: 'test-app-id',
    VITE_APP_ENV: 'test',
    VITE_GOOGLE_SSO_CLIENT_ID: 'test-client-id',
  },
}));

import { getTenantFromUrl } from './getTenantFromUrl';

describe('getTenantFromUrl', () => {
  const originalWindow = window;

  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: {
        location: {
          pathname: '',
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
    });
  });

  it('extracts tenant name when org is present in URL', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/org/tenant123/dashboard' },
      writable: true,
    });
    expect(getTenantFromUrl()).toBe('tenant123');
  });

  it('returns first segment as tenant when org is not in URL and first segment is not a known route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/dashboard/settings' },
      writable: true,
    });
    expect(getTenantFromUrl()).toBe('dashboard');
  });

  it('returns empty string when first segment is a known route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/login' },
      writable: true,
    });
    expect(getTenantFromUrl()).toBe('');
  });

  it('handles multiple org occurrences in URL', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/org/tenant123/org/nested' },
      writable: true,
    });
    expect(getTenantFromUrl()).toBe('tenant123');
  });

  it('handles trailing slashes', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/org/tenant123/' },
      writable: true,
    });
    expect(getTenantFromUrl()).toBe('tenant123');
  });
});
