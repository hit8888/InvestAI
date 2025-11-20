import { useSessionStore } from '../stores/useSessionStore';

const useIsAdmin = (): boolean => {
  const activeTenant = useSessionStore((state) => state.activeTenant);
  // activeTenant is set by useTenantRedirect from organizations array, so we can directly check its role
  return activeTenant?.role === 'admin';
};

export default useIsAdmin;
