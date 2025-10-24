import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { useAuth } from '../context/AuthProvider';
import { setupTenantAndAgent } from '../utils/apiCalls';
import toast from 'react-hot-toast';

export const useTenantRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantName: tenantNameParam } = useParams();
  const { userInfo, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !userInfo) {
      return;
    }

    const tenantNameFromStorage = getTenantFromLocalStorage();
    const organizations = userInfo?.organizations || [];

    // If no tenant in URL and no tenant in storage, redirect to dashboard
    if (!tenantNameParam && !tenantNameFromStorage) {
      navigate('/', { replace: true });
      return;
    }

    // If tenant in URL, validate it exists in user's organizations
    if (tenantNameParam) {
      const matchingOrg = organizations.find((org) => org['tenant-name'] === tenantNameParam);

      if (matchingOrg) {
        // URL is source of truth - only update localStorage in background if different
        // Don't navigate or call setupTenantAndAgent here to avoid race conditions
        if (tenantNameFromStorage !== tenantNameParam) {
          // Silently sync localStorage to URL (background operation, non-blocking)
          setupTenantAndAgent(matchingOrg).catch((error) => {
            console.warn('Background tenant sync failed:', error);
          });
        }
      } else {
        // If tenant doesn't exist in user's organizations, redirect to dashboard
        toast.error('Invalid organization');
        navigate('/', { replace: true });
      }
      return;
    }

    // If no tenant in URL but exists in storage, redirect to tenant path
    if (!tenantNameParam && tenantNameFromStorage) {
      const newPath = `/${tenantNameFromStorage}${location.pathname}${location.search}`;
      navigate(newPath, { replace: true });
    }
  }, [tenantNameParam, navigate, location.pathname, location.search, userInfo, isAuthenticated]);
};
