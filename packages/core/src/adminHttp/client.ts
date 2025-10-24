import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@meaku/core/types/env';
import { authInstance } from '../contexts/AuthInstance';
import { regenerateTokens } from './api';
import { getAccessTokenFromLocalStorage, getTenantFromLocalStorage, getTenantFromUrl } from '@meaku/core/utils/index';

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

// Add request interceptor to conditionally set "x-tenant-name" & "Authorization" header before each request
adminApiClient.interceptors.request.use(
  (config) => {
    // PRIORITY: Get tenant from URL first (source of truth), fallback to localStorage
    const tenantName = getTenantFromUrl() || getTenantFromLocalStorage();
    if (tenantName) {
      config.headers['x-tenant-name'] = tenantName;
    }
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
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
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await regenerateTokens({ refresh: refreshToken });
          const { access } = response.data;

          localStorage.setItem('accessToken', access);

          // Update tokens and user data using auth context
          if (authInstance) {
            authInstance.saveTokens(access, refreshToken);
          }

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
        // Clear all tokens and auth state
        if (authInstance?.logout) {
          authInstance.logout();
        }

        if (authInstance?.clearAuthValuesFromLocalStorage) {
          authInstance.clearAuthValuesFromLocalStorage();
        }

        // Process any queued requests with the error
        processQueue(error, null);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default adminApiClient;
