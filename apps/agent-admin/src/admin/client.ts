import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@meaku/core/types/env';
import { authInstance } from '../context/AuthInstance';
import { getUserDataFromMeAPI, regenerateTokens } from './api';
import { getAccessTokenFromLocalStorage, getTenantFromLocalStorage } from '../utils/common';

// Add custom type for request config with _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
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
    const tenantName = getTenantFromLocalStorage();
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

        // Get updated user data
        const userResponse = await getUserDataFromMeAPI();
        const { data: userInfo } = userResponse;

        // Update tokens and user data using auth context
        if (authInstance) {
          authInstance.saveTokens(access, refreshToken, userInfo);
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

    return Promise.reject(error);
  },
);

export default adminApiClient;
