import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Valid panel modes for different drawer types
 */
export type PanelMode = 'generated-email' | 'conversation-log' | 'relevant-profiles' | 'browsing-history' | null;

/**
 * Custom hook for managing panel state via URL parameters
 *
 * This hook manages the left-side panel state in row detail drawers
 * using URL search parameters instead of local state, enabling:
 * - Deep linking to specific panels
 * - State persistence across page refreshes
 * - Browser back/forward navigation
 *
 * @param urlParam - The URL parameter name to use (default: 'panel')
 * @returns Object with current mode and setter functions
 */
export const usePanelState = (urlParam: string = 'panel') => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current panel mode from URL
  // Handle backward compatibility: redirect old 'conversation-details' to 'conversation-log'
  const urlMode = searchParams.get(urlParam);
  let currentMode: PanelMode = null;

  if (urlMode === 'conversation-details') {
    // Backward compatibility: redirect old panel id to new one
    currentMode = 'conversation-log';
    // Update URL to use new panel id
    setSearchParams(
      (prev) => {
        prev.set(urlParam, 'conversation-log');
        return prev;
      },
      { replace: true },
    );
  } else if (
    urlMode &&
    ['generated-email', 'conversation-log', 'relevant-profiles', 'browsing-history'].includes(urlMode)
  ) {
    currentMode = urlMode as PanelMode;
  }

  // Set panel mode in URL
  const setPanelMode = useCallback(
    (mode: PanelMode) => {
      setSearchParams(
        (prev) => {
          if (mode === null) {
            prev.delete(urlParam);
          } else {
            prev.set(urlParam, mode);
          }
          return prev;
        },
        { replace: true },
      ); // Use replace to avoid cluttering browser history
    },
    [urlParam, setSearchParams],
  );

  // Clear panel mode from URL
  const clearPanelMode = useCallback(() => {
    setPanelMode(null);
  }, [setPanelMode]);

  // Check if a specific mode is currently active
  const isMode = useCallback(
    (mode: PanelMode) => {
      return currentMode === mode;
    },
    [currentMode],
  );

  // Check if any panel is open
  const hasActivePanel = currentMode !== null;

  return {
    currentMode,
    setPanelMode,
    clearPanelMode,
    isMode,
    hasActivePanel,
  };
};

/**
 * Panel mode labels for UI display
 */
export const PANEL_MODE_LABELS: Record<NonNullable<PanelMode>, string> = {
  'generated-email': 'Generated Email',
  'conversation-log': 'Conversation Log',
  'relevant-profiles': 'Relevant Profiles',
  'browsing-history': 'Browsing History',
};

/**
 * Panel mode max width constraints
 */
export const PANEL_MODE_MAX_WIDTH: Record<NonNullable<PanelMode>, string | undefined> = {
  'generated-email': '35vw',
  'conversation-log': '35vw',
  'relevant-profiles': '35vw',
  'browsing-history': '35vw',
};
