import { createContext, ReactNode, useContext, useState } from 'react';
// import axios from 'axios';
// import { ENV } from '../../../../apps/chatbot/src/config/env';

import { AuthResponse } from '@meaku/core/types/admin/auth';
import {
  // ACCESS_TOKEN_EXPIRATION_TIME,
  DefaultAuthResponse,
} from '../utils/constants';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  // apiCall?: (config: any) => Promise<any>;
  saveTokens?: (newAccessToken: string, newRefreshToken: string, userData?: AuthResponse) => void;
  clearTokens?: () => void;
  login: () => void;
  logout: () => void;
  userInfo?: AuthResponse;
}

interface AuthProviderProps {
  children: ReactNode;
}

const defaultContext: AuthContextType = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  saveTokens: () => {},
  // apiCall: () => Promise.resolve(),
  clearTokens: () => {},
  login: () => {},
  logout: () => {},
  userInfo: DefaultAuthResponse,
};

// const api = axios.create({
//   baseURL: ENV.VITE_BASE_API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
//   withCredentials: true, // Important for cookies
// });

// Create Auth Context
export const AuthContext = createContext<AuthContextType>(defaultContext);

// AuthProvider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userInfo, setUserInfo] = useState(DefaultAuthResponse);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Save tokens and update state
  const saveTokens = (newAccessToken: string, newRefreshToken: string, userData?: AuthResponse) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    if (userData) {
      setUserInfo(userData);
    }

    // Store tokens in local storage
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // Clear tokens
  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);

    // Clear tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
  };

  // API call with auto-refresh token logic

  // const apiCall = async (config: any) => {
  //   try {
  //     // Add Authorization header to the request
  //     config.headers = {
  //       ...config.headers,
  //       Authorization: `Bearer ${accessToken}`,
  //     };

  //     const response = await api(config);
  //     return response.data;
  //   } catch (error) {
  //     // Check if the error is 401 (unauthorized)
  //     if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
  //       try {
  //         // Attempt to refresh the token
  //         const refreshResponse = await api.post('api/token/refresh/', {
  //           refreshToken,
  //         });

  //         // Save the new tokens
  //         const { access: newAccessToken, refresh: newRefreshToken, user } = refreshResponse.data;
  //         saveTokens(newAccessToken, newRefreshToken, user);

  //         // Retry the original request with the new access token
  //         config.headers.Authorization = `Bearer ${newAccessToken}`;
  //         const retryResponse = await api(config);
  //         return retryResponse.data;
  //       } catch (refreshError) {
  //         // If refreshing fails, clear tokens and throw an error
  //         clearTokens();
  //         throw new Error('Session expired. Please log in again.' + refreshError);
  //       }
  //     }

  //     // If the error is not 401, rethrow it
  //     throw error;
  //   }
  // };

  // Function to set authentication status
  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    clearTokens();
  };

  return (
    <AuthContext
      value={{
        accessToken,
        refreshToken,
        saveTokens,
        clearTokens,
        // apiCall,
        isAuthenticated,
        login,
        logout,
        userInfo,
      }}
    >
      {children}
    </AuthContext>
  );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
