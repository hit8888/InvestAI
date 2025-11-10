import { NavigateFunction } from 'react-router-dom';
import { UserInfoResponse } from '@meaku/core/types/admin/api';
import { AppRoutesEnum } from './constants';
import { useSessionStore } from '../stores/useSessionStore';
import { navigateToDefaultRoute } from './navigation';

/**
 * Shared utility function to handle login and redirection after authentication
 */
export const handleLoginAndRedirection = (
  userData: UserInfoResponse,
  accessToken: string,
  refreshToken: string,
  navigate: NavigateFunction,
) => {
  const { setTokens, setUserInfo, login } = useSessionStore.getState();

  // Set tokens and user info
  setTokens(accessToken, refreshToken);
  setUserInfo(userData);
  login();

  // Check for saved redirect URL
  try {
    const savedRedirectPath = localStorage.getItem('redirectAfterLogin');
    if (savedRedirectPath) {
      const parsedPath = JSON.parse(savedRedirectPath);
      if (parsedPath && parsedPath !== '/' && parsedPath !== `/${AppRoutesEnum.LOGIN}`) {
        // Clear the saved path and redirect to it
        localStorage.removeItem('redirectAfterLogin');
        navigate(parsedPath, { replace: true });
        return;
      }
    }
  } catch (error) {
    console.warn('Error parsing redirectAfterLogin from localStorage:', error);
    localStorage.removeItem('redirectAfterLogin');
  }

  // Navigate to default route if no saved redirect
  navigateToDefaultRoute(navigate);
};
