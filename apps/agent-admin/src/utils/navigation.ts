import { Location, To, NavigateOptions } from 'react-router-dom';

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
