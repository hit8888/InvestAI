import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useShadowRoot } from '../containers/ShadowRootProvider';

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
  BEHIND_CONTENT: 'z-behind-content',
} as const;

/**
 * Hook for rendering React components in portals
 * Works within Shadow DOM boundaries for web components
 */
export function usePortal(type: keyof typeof Z_INDEX_CLASSES) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const { root: shadowRoot, fallbackRoot } = useShadowRoot();

  useEffect(() => {
    try {
      const rootContainer = shadowRoot || fallbackRoot;
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
          pointer-events: none;
        `;
        container.classList.add(Z_INDEX_CLASSES[type]);
        rootContainer.appendChild(container);
      }

      setPortalContainer(container);
    } catch (error) {
      console.warn(`Failed to get portal container for type "${type}":`, error);
    }
  }, [type, shadowRoot, fallbackRoot]);

  const renderInPortal = (children: React.ReactNode) => {
    if (!portalContainer) {
      return null;
    }

    return createPortal(children, portalContainer);
  };

  const getZIndexClass = () => {
    return Z_INDEX_CLASSES[type];
  };

  return {
    portalContainer,
    renderInPortal,
    getZIndexClass,
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
