import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

function RedirectGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantName: tanantNameParam } = useParams();

  useEffect(() => {
    const tenantNameFromStorage = getTenantFromLocalStorage();

    if ((tanantNameParam && location.pathname === `/${tanantNameParam}`) || !tenantNameFromStorage) {
      navigate('/', { replace: true });
      return;
    }

    if (!tanantNameParam) {
      const newPath = `/${tenantNameFromStorage}${location.pathname}${location.search}`;
      navigate(newPath, { replace: true });
    }
  }, [tanantNameParam, navigate, location]);

  return <Outlet />;
}

export default RedirectGuard;
