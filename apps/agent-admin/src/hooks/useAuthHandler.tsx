import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { URL_ROUTE_LEADS_PAGE, URL_ROUTE_LOGIN_PAGE } from '../utils/constants';

const useAuthHandler = () => {
  const { login, saveTokens } = useAuth();
  const navigate = useNavigate();

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
      navigate(URL_ROUTE_LEADS_PAGE); // Redirect to leads page
    } else {
      navigate(URL_ROUTE_LOGIN_PAGE); // Redirect to login if tokens are not present
    }
  }, [navigate]);
};

export default useAuthHandler;
