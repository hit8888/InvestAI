import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageRouteState from './usePageRouteState';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';
import { getUserDataFromMeAPI, regenerateTokens } from '../admin/api';

const useAuthHandler = () => {
  const { login, saveTokens } = useAuth();
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
    } catch (error) {
      console.error('Failed to refresh token', error);
      navigate(LOGIN);
    }
  };

  useEffect(() => {
    // Check for tokens in local storage on page load
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUserInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo') as string)
      : null;

    if (storedAccessToken && storedRefreshToken) {
      saveTokens(storedAccessToken, storedRefreshToken, storedUserInfo);
      login(); // Set isAuthenticated to true

      if (isLoginPage) {
        navigate(LEADS);
      } else {
        navigate(pathURL);
      }
    } else {
      navigate(LOGIN); // Redirect to login if tokens are not present
    }
  }, [navigate]);

  return { refreshTokens };
};

export default useAuthHandler;
