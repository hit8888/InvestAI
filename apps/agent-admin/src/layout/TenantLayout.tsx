import { Outlet, useParams, useLocation } from 'react-router-dom';
import { useTenantRedirect } from '../hooks/useTenantRedirect';

/**
 * Layout component for protected routes only
 * Handles tenant routing logic - login and OAuth routes are not children of this layout
 * Dashboard is accessible at root path without tenantName
 */
const TenantLayout = () => {
  const { tenantName } = useParams();
  const location = useLocation();

  useTenantRedirect();

  // Dashboard is accessible at root path without tenantName
  const isRootPath = location.pathname === '/' || location.pathname === '';
  if (!tenantName && !isRootPath) {
    return null;
  }

  return <Outlet />;
};

export default TenantLayout;
