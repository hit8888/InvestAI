import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSessionStore } from '../stores/useSessionStore';
import { useQueryClient } from '@tanstack/react-query';

import { DEFAULT_ROUTE } from '../utils/constants';
import { getValidTenantFromOrganizations } from '../utils/common';
import { buildPathWithTenantBase, navigateToDefaultRoute } from '../utils/navigation';

/**
 * Hook to handle authentication and tenant routing logic
 * Manages redirects based on auth state and tenant validation
 */
export const useTenantRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantName: tenantNameParam } = useParams();
  const { isAuthenticated, userInfo, activeTenant, setActiveTenant } = useSessionStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Auth initialization complete - only handle routing if authenticated
    if (!isAuthenticated || !userInfo) {
      return; // ProtectedRoute will handle redirect to login
    }

    // Dashboard is accessible at root path without tenantName - don't redirect
    if (location.pathname === '/' || location.pathname === '') {
      return;
    }

    const organizations = userInfo.organizations || [];

    // Handle tenant routing - login and OAuth paths are not children of ProtectedLayout
    // If tenant in URL, validate it exists in user's organizations
    if (tenantNameParam) {
      const matchingOrg = organizations.find((org) => org['tenant-name'] === tenantNameParam);

      if (matchingOrg) {
        // Check if path is exactly /tenantName or /tenantName/ - redirect to default route
        const normalizedPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash
        if (normalizedPath === `/${tenantNameParam}`) {
          // Redirect to default route for this tenant
          navigate(buildPathWithTenantBase(tenantNameParam, DEFAULT_ROUTE), { replace: true });
          return;
        }

        // URL is source of truth - update store if different
        if (activeTenant?.['tenant-name'] !== tenantNameParam) {
          setActiveTenant(matchingOrg);
          queryClient.removeQueries({
            predicate: (query) => {
              const queryKey = query.queryKey;
              // Preserve user-info query - it's the same across all tenants
              return queryKey[0] !== 'user-info';
            },
          });
        }
      } else {
        // Invalid tenant - redirect to dashboard
        toast.error('Invalid organization');
        navigateToDefaultRoute(navigate);
      }
    } else {
      // No tenant in URL but exists in storage - redirect to tenant path
      const tenantName = activeTenant?.['tenant-name'];
      if (tenantName) {
        const newPath = `/${tenantName}${location.pathname}${location.search}`;
        navigate(newPath, { replace: true });
      } else {
        const targetOrg = getValidTenantFromOrganizations(organizations, tenantNameParam ?? null);
        if (targetOrg) {
          const newPath = `/${targetOrg?.['tenant-name']}${location.pathname}${location.search}`;
          navigate(newPath, { replace: true });
        } else {
          navigateToDefaultRoute(navigate);
        }
      }
    }
  }, [
    isAuthenticated,
    location.pathname,
    location.search,
    navigate,
    userInfo,
    activeTenant,
    setActiveTenant,
    tenantNameParam,
    queryClient,
  ]);
};
