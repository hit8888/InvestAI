import { ENV } from '@meaku/core/types/env';
import axios from 'axios';
import { getAccessTokenFromLocalStorage, getTenantFromLocalStorage } from '../utils/common';

const adminApiClient = axios.create({
  baseURL: ENV.VITE_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

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

export default adminApiClient;
