import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageRouteState from './usePageRouteState';
import { useAuth } from '../context/AuthProvider';
import { DEFAULT_ROUTE } from '../utils/constants';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { getDashboardBasicPathURL } from '../utils/common';
import { useLoginWithEmailPasswordMutationState } from '../queries/mutation/useLoginWithEmailPassword';
import useUserInfoQuery from '../queries/query/useUserInfoQuery';

const useAuthHandler = () => {
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  const { login, saveTokens, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isLoginPage, pathURL } = usePageRouteState();
  const comingFromLogin = useLoginWithEmailPasswordMutationState();
  const userInfoQuery = useUserInfoQuery({
    // If user is authenticated and coming from login, we don't need to fetch user info again
    enabled: !!storedAccessToken && !comingFromLogin,
  });

  useEffect(() => {
    if (!userInfoQuery.isSuccess || !(storedAccessToken && storedRefreshToken)) {
      return;
    }

    saveTokens(storedAccessToken, storedRefreshToken, userInfoQuery.data);
    login(); // Set isAuthenticated to true

    const tenantName = getTenantIdentifier()?.['tenant-name'] ?? '';
    const defaultRoute = getDashboardBasicPathURL(`${tenantName}/${DEFAULT_ROUTE}`);
    if (isLoginPage) {
      if (tenantName) {
        navigate(defaultRoute);
      } else {
        navigate('/');
      }
    } else {
      const basicPathURL = getDashboardBasicPathURL(tenantName);
      const isBaseOrgPath = pathURL === basicPathURL || pathURL === `${basicPathURL}/`;

      if (isBaseOrgPath) {
        navigate(defaultRoute);
      } else {
        navigate(pathURL);
      }
    }
  }, [userInfoQuery.isSuccess]);

  return {
    initialized: storedAccessToken ? isAuthenticated : true,
  };
};

export default useAuthHandler;
