import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageRouteState from './usePageRouteState';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';

const useAuthHandler = () => {
  const { login, saveTokens } = useAuth();
  const navigate = useNavigate();
  const { pathUptoAdmin, isLoginPage, pathURL } = usePageRouteState();

  useEffect(() => {
    // Check for tokens in local storage on page load
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUserInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo') as string)
      : null;

    if (storedAccessToken && storedRefreshToken) {
      if (saveTokens) {
        saveTokens(storedAccessToken, storedRefreshToken, storedUserInfo);
      }
      login(); // Set isAuthenticated to true
      if (isLoginPage) {
        navigate(`${pathUptoAdmin}/${AppRoutesEnum.LEADS}`);
      } else {
        navigate(pathURL);
      }
    } else {
      navigate(`${pathUptoAdmin}/${AppRoutesEnum.LOGIN}`); // Redirect to login if tokens are not present
    }
  }, [navigate]);
};

export default useAuthHandler;
