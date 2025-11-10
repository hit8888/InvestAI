import { Location, To, NavigateOptions, NavigateFunction } from 'react-router-dom';
import { DEFAULT_ROUTE } from './constants';
import { getValidTenantFromOrganizations } from './common';
import { useSessionStore } from '../stores/useSessionStore';

/**
 * Build a tenant-scoped absolute path by prefixing the current tenant base to a relative path.
 * Example: current "/acme/ai-blocks" + "/ai-blocks/123" => "/acme/ai-blocks/123"
 */
export function buildTenantScopedPath(currentPathname: string, relativePath: string): string {
  const aiBlocksIndex = currentPathname.indexOf('/ai-blocks');
  const base = aiBlocksIndex >= 0 ? currentPathname.substring(0, aiBlocksIndex) : currentPathname;
  return `${base}${relativePath}`.replace(/\/+$/, '');
}

/**
 * Helper to navigate to a path and request a smooth scroll to a section id on the destination.
 * Uses location.state to avoid polluting the URL. Destination page should use `useScrollToSection`.
 */
export function navigateToSection(
  navigate: (to: To, options?: NavigateOptions) => void,
  location: Location,
  relativePath: string,
  scrollToId: string,
  scrollOffset?: number,
) {
  const newPath = buildTenantScopedPath(location.pathname, relativePath);
  const state: { scrollToId: string; scrollOffset?: number } = { scrollToId };
  if (typeof scrollOffset === 'number') state.scrollOffset = scrollOffset;
  navigate(newPath, { state });
}

export const buildPathWithTenantBase = (tenantName: string, relativePath: string): string => {
  return `/${tenantName.replace(/\/+$/, '')}/${relativePath}`.replace(/\/+$/, '');
};

/**
 * Get the default route path based on user organizations
 * Returns the tenant-scoped default route or '/' if no valid tenant is found
 */
export const getDefaultRoute = (): string => {
  const { userInfo, activeTenant } = useSessionStore.getState();

  if (!userInfo) {
    return '/';
  }

  const organizations = userInfo?.organizations || [];

  const targetOrg = getValidTenantFromOrganizations(organizations, activeTenant?.['tenant-name'] ?? null);
  if (targetOrg) {
    const tenantName = targetOrg['tenant-name'] ?? '';
    return buildPathWithTenantBase(tenantName, DEFAULT_ROUTE);
  }

  return '/';
};

/**
 * Shared utility function to handle navigation to default route based on user organizations
 * Assumes user is already authenticated and userInfo is set
 */
export const navigateToDefaultRoute = (navigate: NavigateFunction, options?: NavigateOptions) => {
  const route = getDefaultRoute();
  navigate(route, { replace: true, ...options });
};
