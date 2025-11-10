import { useEffect } from 'react';
import { useSessionStore } from '../stores/useSessionStore';
import useUserInfoQuery from '../queries/query/useUserInfoQuery';
import toast from 'react-hot-toast';

/**
 * Hook to initialize auth state using React Query
 * Fetches user info if tokens exist in localStorage but userInfo is not yet loaded
 * Skips query if user is already authenticated (e.g., just logged in)
 */
export const useAuthInitializer = () => {
  const { accessToken, refreshToken, setUserInfo, login, clearAuth, isAuthenticated, userInfo } = useSessionStore();
  const hasTokens = !!(accessToken && refreshToken);

  // Only fetch userInfo if we have tokens but don't have userInfo yet (not authenticated)
  // If we just logged in, userInfo is already set, so skip the query
  const shouldFetchUserInfo = hasTokens && !isAuthenticated && (!userInfo || !userInfo.email);

  const userInfoQuery = useUserInfoQuery({
    enabled: shouldFetchUserInfo,
  });

  useEffect(() => {
    if (!hasTokens) {
      return;
    }

    // If already authenticated (e.g., just logged in), no need to fetch
    if (isAuthenticated) {
      return;
    }

    if (userInfoQuery.isSuccess && userInfoQuery.data) {
      // Successfully fetched user info
      setUserInfo(userInfoQuery.data);
      login();
    } else if (userInfoQuery.isError) {
      // Failed to fetch user info - tokens are invalid
      console.error('Failed to initialize auth:', userInfoQuery.error);
      toast.error('Failed to authenticate. Please login again.');
      clearAuth();
    }
  }, [
    hasTokens,
    isAuthenticated,
    userInfoQuery.isSuccess,
    userInfoQuery.isError,
    userInfoQuery.data,
    userInfoQuery.error,
    setUserInfo,
    login,
    clearAuth,
  ]);

  // Compute isLoading: true if we have tokens but aren't authenticated yet (initializing)
  // Keep loading true until authentication is complete to prevent ProtectedRoute from redirecting prematurely
  const isLoading = hasTokens && !isAuthenticated;

  // If no tokens, we should redirect to login (unless already on login/OAuth pages)
  const shouldRedirectToLogin = !hasTokens && !isAuthenticated;

  return {
    isLoading,
    shouldRedirectToLogin,
  };
};
