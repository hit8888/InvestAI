import { useEffect, useRef } from 'react';

/**
 * Hook to listen for URL changes and execute a callback when the URL changes
 *
 * @param callback - Function to execute when URL changes
 * @param options - Optional configuration
 * @param options.immediate - Whether to execute callback immediately on mount (default: false)
 *
 * @example
 * ```tsx
 * // Basic usage
 * useHistory((currentUrl, previousUrl) => {
 *   console.log(`URL changed from ${previousUrl} to ${currentUrl}`);
 * });
 *
 * // With immediate execution
 * useHistory((currentUrl) => {
 *   updateParentUrl(currentUrl);
 * }, { immediate: true });
 * ```
 */
export function useHistory(
  callback: (currentUrl: string, previousUrl: string) => void,
  options: { immediate?: boolean } = {},
) {
  const { immediate = false } = options;
  const currentUrlRef = useRef<string>(window.location.href);
  const originalPushStateRef = useRef<typeof history.pushState | null>(null);
  const originalReplaceStateRef = useRef<typeof history.replaceState | null>(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    currentUrlRef.current = currentUrl;

    // Execute callback immediately if requested
    if (immediate) {
      callback(currentUrl, currentUrl);
    }

    const handleUrlChange = () => {
      const newUrl = window.location.href;
      if (currentUrlRef.current !== newUrl) {
        const previousUrl = currentUrlRef.current;
        currentUrlRef.current = newUrl;
        callback(newUrl, previousUrl);
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange);

    // Store original methods
    originalPushStateRef.current = history.pushState;
    originalReplaceStateRef.current = history.replaceState;

    // Override pushState to detect programmatic navigation
    history.pushState = function (...args) {
      originalPushStateRef.current?.apply(history, args);
      setTimeout(() => {
        handleUrlChange();
      }, 0);
    };

    // Override replaceState to detect programmatic navigation
    history.replaceState = function (...args) {
      originalReplaceStateRef.current?.apply(history, args);
      setTimeout(() => {
        handleUrlChange();
      }, 0);
    };

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handleUrlChange);

      // Restore original methods
      if (originalPushStateRef.current) {
        history.pushState = originalPushStateRef.current;
      }
      if (originalReplaceStateRef.current) {
        history.replaceState = originalReplaceStateRef.current;
      }
    };
  }, [callback, immediate]);

  // Return current URL for convenience
  return currentUrlRef.current;
}
