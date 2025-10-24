import { getTenantIdentifier } from './index';

/**
 * Get tenant name from URL - URL is the PRIMARY source of truth
 * Falls back to localStorage only if tenant is not in URL
 *
 * URL patterns supported:
 * - /:tenantName/... (new pattern)
 * - /org/:tenantName/... (legacy pattern)
 */
export const getTenantFromUrl = (): string => {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);

  // Check for legacy pattern: /org/:tenantName/...
  const orgIndex = pathSegments.indexOf('org');
  if (orgIndex !== -1 && pathSegments[orgIndex + 1]) {
    return pathSegments[orgIndex + 1];
  }

  // Check for new pattern: /:tenantName/...
  // First segment is tenant name if it's not a known route
  const knownRoutes = ['login', 'logout', 'auth', 'callback'];
  if (pathSegments.length > 0 && !knownRoutes.includes(pathSegments[0])) {
    return pathSegments[0];
  }

  // Fallback to localStorage (used only during initial navigation)
  const tenantNameFromLocalStorage: string = getTenantIdentifier()?.['tenant-name'] ?? '';
  return tenantNameFromLocalStorage;
};

/**
 * Get full tenant identifier from URL and validate against localStorage
 * This ensures we have all tenant data, not just the name
 */
export const getTenantIdentifierFromUrl = () => {
  const tenantNameFromUrl = getTenantFromUrl();
  const tenantFromStorage = getTenantIdentifier();

  // If URL tenant matches storage, return full data from storage
  if (tenantFromStorage?.['tenant-name'] === tenantNameFromUrl) {
    return tenantFromStorage;
  }

  // If URL has tenant but doesn't match storage, return minimal data
  // This can happen during tenant switch before storage updates
  if (tenantNameFromUrl) {
    return {
      'tenant-name': tenantNameFromUrl,
      // Other fields will be undefined, components should handle this
    };
  }

  // No tenant in URL, fallback to storage
  return tenantFromStorage;
};
