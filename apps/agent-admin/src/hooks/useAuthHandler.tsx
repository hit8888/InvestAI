import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageRouteState from './usePageRouteState';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { getDashboardBasicPathURL } from '../utils/common';

const useAuthHandler = () => {
  const { login, saveTokens } = useAuth();
  const navigate = useNavigate();
  const { isLoginPage, pathURL, isOAuthCallbackPage } = usePageRouteState();
  const { LOGIN, LEADS } = AppRoutesEnum;

  useEffect(() => {
    if (isOAuthCallbackPage) {
      return;
    }

    // Check for tokens in local storage on page load
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUserInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo') as string)
      : null;

    if (storedAccessToken && storedRefreshToken) {
      saveTokens(storedAccessToken, storedRefreshToken, storedUserInfo);
      login(); // Set isAuthenticated to true

      const tenantName = getTenantIdentifier()?.['tenant-name'] ?? '';
      const leadsPath = `${getDashboardBasicPathURL(tenantName)}/${LEADS}`;
      if (isLoginPage) {
        if (tenantName) {
          navigate(leadsPath);
        } else {
          navigate('/');
        }
      } else {
        const basicPathURL = getDashboardBasicPathURL(tenantName);
        const isBaseOrgPath = pathURL === basicPathURL || pathURL === `${basicPathURL}/`;

        if (isBaseOrgPath) {
          navigate(leadsPath);
        } else {
          navigate(pathURL);
        }
      }
    } else {
      navigate(LOGIN); // Redirect to login if tokens are not present
    }
  }, [navigate]);
};

export default useAuthHandler;
