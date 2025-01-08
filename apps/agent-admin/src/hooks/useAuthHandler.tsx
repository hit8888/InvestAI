import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageRouteState from './usePageRouteState';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum, ACCESS_TOKEN_EXPIRATION_TIME } from '../utils/constants';
import { getUserDataFromMeAPI, regenerateTokens } from '../admin/api';

const useAuthHandler = () => {
  const { login, saveTokens, clearTokens } = useAuth();
  const navigate = useNavigate();
  const { isLoginPage, pathURL } = usePageRouteState();
  const { LOGIN, LEADS } = AppRoutesEnum;

  // Helper function to refresh tokens
  const refreshTokens = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      navigate(LOGIN);
      return;
    }

    try {
      const response = await regenerateTokens({ refresh: storedRefreshToken });
      const { access } = response.data;

      localStorage.setItem('accessToken', access);

      const userResponse = await getUserDataFromMeAPI();
      const { data: userInfo } = userResponse;

      saveTokens(access, storedRefreshToken, userInfo);

      startAccessTokenTimer(ACCESS_TOKEN_EXPIRATION_TIME);
    } catch (error) {
      console.error('Failed to refresh token', error);
      navigate(LOGIN);
    }
  };

  // Helper function to start a timer for access token expiration
  const startAccessTokenTimer = (expiryInSeconds: number) => {
    setTimeout(() => {
      localStorage.removeItem('accessToken');
      const refreshTokenExpiry = parseInt(localStorage.getItem('refreshTokenExpiry') || '0');

      if (Date.now() > refreshTokenExpiry) {
        clearTokens();
        navigate(LOGIN); // Refresh token also expired
      } else {
        refreshTokens(); // Refresh tokens using the valid refresh token
      }
    }, expiryInSeconds * 1000); // Convert to milliseconds
  };

  useEffect(() => {
    // Check for tokens in local storage on page load
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedAccessTokenExpiry = parseInt(localStorage.getItem('accessTokenExpiry') || '0');
    const storedUserInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo') as string)
      : null;

    if (storedAccessToken && storedRefreshToken) {
      saveTokens(storedAccessToken, storedRefreshToken, storedUserInfo);
      login(); // Set isAuthenticated to true

      if (Date.now() > storedAccessTokenExpiry) {
        refreshTokens(); // Access token expired, attempt to refresh
      } else {
        startAccessTokenTimer((storedAccessTokenExpiry - Date.now()) / 1000); // Remaining time in seconds
      }

      if (isLoginPage) {
        navigate(LEADS);
      } else {
        navigate(pathURL);
      }
    } else {
      navigate(LOGIN); // Redirect to login if tokens are not present
    }
  }, [navigate]);
};

export default useAuthHandler;
