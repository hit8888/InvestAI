import { createContext, ReactNode, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { setAuthInstance } from '@meaku/core/contexts/AuthInstance';
import { UserInfoResponse } from '@meaku/core/types/admin/api';
import { DEFAULT_ROUTE, DefaultAuthResponse } from '../utils/constants';
import { setupTenantAndAgent } from '../utils/apiCalls';
import { getDashboardBasicPathURL } from '../utils/common';
import { getTenantIdentifier } from '@meaku/core/utils/index';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  saveTokens: (newAccessToken: string, newRefreshToken: string, userData?: UserInfoResponse) => void;
  clearStateValuesAndLocalStorage: () => void;
  login: () => void;
  logout: () => void;
  userInfo?: UserInfoResponse;
  updateUserInfo: (userData: Partial<UserInfoResponse>) => void;
  handleLoginAndRedirection: (userData: UserInfoResponse, callback: (path: string) => void) => Promise<void>;
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
  updateUserInfo: () => {},
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
  const saveTokens = useCallback((newAccessToken: string, newRefreshToken: string, userData?: UserInfoResponse) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    if (userData) {
      setUserInfo(userData);
    }

    // Store tokens in local storage
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('userEmail', userData?.email ?? '');
  }, []);

  const clearStateValues = useCallback(() => {
    setUserInfo(DefaultAuthResponse);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  }, []);

  const clearAuthValuesFromLocalStorage = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('admin_tenant_identifier');
  }, []);

  // Clear tokens
  const clearStateValuesAndLocalStorage = useCallback(() => {
    clearStateValues();
    clearAuthValuesFromLocalStorage();
  }, [clearStateValues, clearAuthValuesFromLocalStorage]);

  // Function to set authentication status
  const login = useCallback(() => setIsAuthenticated(true), []);
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    clearStateValuesAndLocalStorage();
  }, [clearStateValuesAndLocalStorage]);

  // Function to update user info
  const updateUserInfo = useCallback((userData: Partial<UserInfoResponse>) => {
    setUserInfo((prev) => ({ ...prev, ...userData }));
  }, []);

  const handleLoginAndRedirection = useCallback(
    async (userData: UserInfoResponse, callback: (path: string) => void) => {
      login();

      const org = userData?.organizations;
      // Check for saved redirect URL
      const savedRedirectPath = JSON.parse(localStorage.getItem('redirectAfterLogin') ?? '""');

      if (savedRedirectPath && savedRedirectPath !== '/') {
        // Clear the saved path
        callback(savedRedirectPath);
        localStorage.removeItem('redirectAfterLogin');
        return;
      }

      // Check organization count
      const orgCount = org?.length ?? 0;

      if (orgCount > 1) {
        // Multiple orgs - auto-select using hybrid approach
        // Try last used tenant from localStorage, fallback to first org
        const lastTenant = getTenantIdentifier();
        const targetOrg = org.find((o) => o['tenant-name'] === lastTenant?.['tenant-name']) || org[0];

        await setupTenantAndAgent(targetOrg);
        const basicPathURL = getDashboardBasicPathURL(targetOrg['tenant-name'] ?? '');
        callback(`${basicPathURL}/${DEFAULT_ROUTE}`);
      } else if (orgCount === 1) {
        // single org - redirect to organization dashboard
        const singleOrg = org[0];
        await setupTenantAndAgent(singleOrg);
        const basicPathURL = getDashboardBasicPathURL(singleOrg['tenant-name'] ?? '');
        callback(`${basicPathURL}/${DEFAULT_ROUTE}`);
      } else {
        // Default fallback
        callback('/');
      }
    },
    [login],
  );

  // Register auth instance
  useEffect(() => {
    setAuthInstance({ saveTokens, logout, clearAuthValuesFromLocalStorage });
    return () => setAuthInstance(null);
  }, [saveTokens, logout, clearAuthValuesFromLocalStorage]);

  const contextValue = useMemo(
    () => ({
      accessToken,
      refreshToken,
      saveTokens,
      clearStateValuesAndLocalStorage,
      isAuthenticated,
      login,
      logout,
      userInfo,
      updateUserInfo,
      handleLoginAndRedirection,
    }),
    [
      accessToken,
      refreshToken,
      saveTokens,
      clearStateValuesAndLocalStorage,
      isAuthenticated,
      login,
      logout,
      userInfo,
      updateUserInfo,
      handleLoginAndRedirection,
    ],
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
