import { useLocation } from 'react-router-dom';

const ADMIN_PATHS = ['/demo/', '/debug/'];
const READONLY_PATHS = ['/debug/'];

const useIsAdmin = () => {
  const { pathname } = useLocation();
  const isAdmin = ADMIN_PATHS.some((path) => pathname.startsWith(path));
  const isReadOnly = READONLY_PATHS.some((path) => pathname.startsWith(path));

  return { isAdmin, isReadOnly };
};

export default useIsAdmin;
