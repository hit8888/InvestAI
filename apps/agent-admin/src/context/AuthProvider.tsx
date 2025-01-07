import { createContext, ReactNode, useContext, useState } from 'react';

import { AuthResponse, organizationDetails } from '@meaku/core/types/admin/auth';
import { ACCESS_TOKEN_EXPIRATION_TIME, DefaultAuthResponse, REFRESH_TOKEN_EXPIRATION_TIME } from '../utils/constants';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  saveTokens?: (newAccessToken: string, newRefreshToken: string, userData?: AuthResponse) => void;
  clearTokens?: () => void;
  login: () => void;
  logout: () => void;
  userInfo?: AuthResponse;
  setTenantIdentifier: (tenantObj: organizationDetails) => void;
  getTenantIdentifier: () => organizationDetails | null;
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
  setTenantIdentifier: () => {},
  getTenantIdentifier: () => null,
};

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
    localStorage.setItem('accessTokenExpiry', JSON.stringify(Date.now() + ACCESS_TOKEN_EXPIRATION_TIME * 1000)); // in ms
    localStorage.setItem('refreshTokenExpiry', JSON.stringify(Date.now() + REFRESH_TOKEN_EXPIRATION_TIME * 1000)); // in ms
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
    localStorage.removeItem('accessTokenExpiry');
    localStorage.removeItem('refreshTokenExpiry');
    localStorage.removeItem('tenant_identifier');
  };

  const setTenantIdentifier = (tenantObj: organizationDetails) => {
    localStorage.setItem('tenant_identifier', JSON.stringify(tenantObj));
  };

  const getTenantIdentifier = () => {
    return JSON.parse(localStorage.getItem('tenant_identifier') || 'null');
  };

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
        setTenantIdentifier,
        getTenantIdentifier,
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
