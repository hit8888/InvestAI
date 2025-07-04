import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { setAuthInstance } from '@meaku/core/contexts/AuthInstance';
import { AuthResponse } from '@meaku/core/types/admin/auth';
import { DEFAULT_ROUTE, DefaultAuthResponse } from '../utils/constants';
import { setupTenantAndAgent } from '../utils/apiCalls';
import { getDashboardBasicPathURL } from '../utils/common';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  saveTokens: (newAccessToken: string, newRefreshToken: string, userData?: AuthResponse) => void;
  clearStateValuesAndLocalStorage: () => void;
  login: () => void;
  logout: () => void;
  userInfo?: AuthResponse;
  handleLoginAndRedirection: (userData: AuthResponse, callback: (path: string) => void) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const defaultContext: AuthContextType = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  saveTokens: () => {},
  clearStateValuesAndLocalStorage: () => {},
  login: () => {},
  logout: () => {},
  userInfo: DefaultAuthResponse,
  handleLoginAndRedirection: () => Promise.resolve(),
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
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('userEmail', userData?.email ?? '');
  };

  const clearStateValues = () => {
    setUserInfo(DefaultAuthResponse);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  const clearAuthValuesFromLocalStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('admin_tenant_identifier');
  };

  // Clear tokens
  const clearStateValuesAndLocalStorage = () => {
    clearStateValues();
    clearAuthValuesFromLocalStorage();
  };

  // Function to set authentication status
  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    clearStateValuesAndLocalStorage();
  };

  const handleLoginAndRedirection = async (userData: AuthResponse, callback: (path: string) => void) => {
    login();

    const org = userData?.organizations;
    const tenantHavingAdminRole = org?.find((item) => item?.['role'] === 'admin');

    // Check for saved redirect URL
    const savedRedirectPath = JSON.parse(localStorage.getItem('redirectAfterLogin') ?? '{}');

    if (savedRedirectPath) {
      // Clear the saved path
      callback(savedRedirectPath);
      localStorage.removeItem('redirectAfterLogin');
      return;
    }

    // If no saved path, proceed with default navigation
    if (tenantHavingAdminRole) {
      await setupTenantAndAgent(tenantHavingAdminRole);
      const basicPathURL = getDashboardBasicPathURL(tenantHavingAdminRole['tenant-name'] ?? '');
      callback(`${basicPathURL}/${DEFAULT_ROUTE}`);
    } else {
      callback('/');
    }
  };

  // Register auth instance
  useEffect(() => {
    setAuthInstance({ saveTokens, logout, clearAuthValuesFromLocalStorage });
    return () => setAuthInstance(null);
  }, [saveTokens, logout, clearAuthValuesFromLocalStorage]);

  return (
    <AuthContext
      value={{
        accessToken,
        refreshToken,
        saveTokens,
        clearStateValuesAndLocalStorage,
        isAuthenticated,
        login,
        logout,
        userInfo,
        handleLoginAndRedirection,
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
