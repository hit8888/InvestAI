import { Outlet } from 'react-router-dom';
import { useTenantRedirect } from '../hooks/useTenantRedirect';

function RedirectGuard() {
  useTenantRedirect();
  return <Outlet />;
}

export default RedirectGuard;
