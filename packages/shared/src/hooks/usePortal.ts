import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useShadowRoot } from '../containers/ShadowRootProvider';

/**
 * Z-Index hierarchy for web components
 * Ensures proper layering across shadow DOM boundaries
 */
export const Z_INDEX_LAYERS = {
  // Interactive overlays (highest - should be above everything)
  TOOLTIPS: 2147483647, // Topmost - tooltips should always be visible
  DROPDOWNS: 2147483646, // Above modals so dropdowns inside modals appear on top
  SELECTS: 2147483645, // Above modals so selects inside modals appear on top
  POPOVERS: 2147483644, // Above modals so popovers inside modals appear on top

  // Modals (above command bar but below interactive elements)
  MODALS: 2147483643,

  // Command bar and main web component containers (below overlays but above host page)
  COMMAND_BAR: 2147483642,

  // Behind content layer (for elements that should render behind main content)
  BEHIND_CONTENT: 2147483640,

  // Fallback for other overlays
  OVERLAY_FALLBACK: 2147483641,
} as const;

export type PortalType = keyof typeof Z_INDEX_LAYERS;

/**
 * Utility classes for z-index values
 * Use these instead of hardcoding z-index values
 */
export const Z_INDEX_CLASSES = {
  TOOLTIPS: 'z-tooltip',
  MODALS: 'z-modal',
  DROPDOWNS: 'z-dropdown',
  POPOVERS: 'z-popover',
  SELECTS: 'z-select',
  COMMAND_BAR: 'z-command-bar',
  OVERLAY_FALLBACK: 'z-overlay-fallback',
} as const;

/**
 * Hook for rendering React components in portals
 * Works within Shadow DOM boundaries for web components
 */
export function usePortal(type: PortalType = 'OVERLAY_FALLBACK') {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const shadowRootContext = useShadowRoot();

  useEffect(() => {
    try {
      // Determine the root container (Shadow DOM or document.body)
      const rootContainer = shadowRootContext?.root || document.body;
      const containerId = `wc-portal-${type.toLowerCase()}`;

      // Try to get existing container from the appropriate root
      let container = rootContainer.querySelector(`#${containerId}`) as HTMLElement;

      if (!container) {
        // Create new container lazily when needed
        container = document.createElement('div');
        container.id = containerId;
        container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: ${Z_INDEX_LAYERS[type]};
          pointer-events: none;
        `;
        rootContainer.appendChild(container);
      }

      setPortalContainer(container);
    } catch (error) {
      console.warn(`Failed to get portal container for type "${type}":`, error);
      // Fallback to document.body
      setPortalContainer(document.body);
    }
  }, [type, shadowRootContext?.root]);

  const renderInPortal = (children: React.ReactNode) => {
    if (!portalContainer) {
      return null;
    }

    return createPortal(children, portalContainer);
  };

  const getZIndex = () => {
    return Z_INDEX_LAYERS[type];
  };

  return {
    portalContainer,
    renderInPortal,
    getZIndex,
    isReady: !!portalContainer,
  };
}

/**
 * Specific hooks for common portal types
 */
export const useTooltipPortal = () => usePortal('TOOLTIPS');
export const useModalPortal = () => usePortal('MODALS');
export const useDropdownPortal = () => usePortal('DROPDOWNS');
export const usePopoverPortal = () => usePortal('POPOVERS');
export const useSelectPortal = () => usePortal('SELECTS');
export const useBehindContentPortal = () => usePortal('BEHIND_CONTENT');
