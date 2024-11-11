import { useLocation } from 'react-router-dom';

const ADMIN_PATHS = ['/demo/', '/internal-admin-use/'];
const READONLY_PATHS = ['/internal-admin-use/'];

const useIsAdmin = () => {
  const { pathname } = useLocation();
  const isAdmin = ADMIN_PATHS.some((path) => pathname.startsWith(path));
  const isReadOnly = READONLY_PATHS.some((path) => pathname.startsWith(path));

  return { isAdmin, isReadOnly };
};

export default useIsAdmin;
