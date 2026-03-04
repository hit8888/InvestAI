import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@neuraltrade/core/types/env';
import { regenerateTokens } from './api';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
interface TokenError {
  detail: string;
  code: string;
  messages?: Array<{
    token_class: string;
    token_type: string;
    message: string;
  }>;
}

/**
 * Token provider interface for dependency injection
 * Allows the axios client to work with any token storage mechanism (localStorage, Zustand store, etc.)
 */
export interface TokenProvider {
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  setAccessToken?: (token: string) => void;
  setRefreshToken?: (token: string) => void;
  removeAccessToken?: () => void;
  removeRefreshToken?: () => void;
  getTenantIdentifier?: () => string | null;
  setTenantIdentifier?: (tenantId: string) => void;
  removeTenantIdentifier?: () => void;
}

// Token provider instance (no-op if not initialized)
let tokenProvider: TokenProvider | null = null;

/**
 * Initialize the admin API client with a token provider
 * This allows using Zustand store or any other token storage mechanism
 */
export const initializeAdminApiClient = (provider: TokenProvider) => {
  tokenProvider = provider;
};

const adminApiClient = axios.create({
  baseURL: ENV.VITE_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Store pending requests that failed due to token expiration
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (error: any) => void;
}> = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Add request interceptor to conditionally set "Authorization" header and tenant header before each request
adminApiClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenProvider?.getAccessToken?.();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const tenantIdentifier = tokenProvider?.getTenantIdentifier?.();
    if (tenantIdentifier) {
      config.headers['x-tenant-name'] = tenantIdentifier;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle token refresh
adminApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const errorData = error.response.data as TokenError;

      // Check if it's an access token expiration
      if (errorData.messages?.[0]?.token_type === 'access') {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return adminApiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Get refresh token from token provider
          const refreshToken = tokenProvider?.getRefreshToken?.();

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await regenerateTokens({ refresh: refreshToken });
          const { access } = response.data;

          // Update access token via token provider
          tokenProvider?.setAccessToken?.(access);

          // Update authorization header
          originalRequest.headers['Authorization'] = `Bearer ${access}`;

          // Process pending requests
          processQueue(null, access);

          return adminApiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      // Check if it's a refresh token expiration
      else if (errorData.code === 'token_not_valid' && !errorData.messages) {
        // Clear auth state via token provider
        tokenProvider?.removeAccessToken?.();
        tokenProvider?.removeRefreshToken?.();
        tokenProvider?.removeTenantIdentifier?.();

        // Process any queued requests with the error
        processQueue(error, null);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default adminApiClient;
