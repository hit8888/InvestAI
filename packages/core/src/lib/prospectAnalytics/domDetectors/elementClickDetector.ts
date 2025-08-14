import type { UpdateProspectPayload } from '../../../types/api/update_prospect_request';

function handleDomElementClick(
  element: HTMLElement,
  selector: string,
  onSubmit: (requestData: UpdateProspectPayload) => void,
) {
  let url: URL;
  let params: Record<string, string> | null = null;
  try {
    let rawUrl: string | undefined;
    if (element instanceof HTMLAnchorElement) {
      rawUrl = element.href;
    } else if (element instanceof HTMLImageElement) {
      rawUrl = element.src;
    }
    if (!rawUrl) return;
    url = new URL(rawUrl);
    params = Object.fromEntries(url.searchParams);
  } catch {
    return;
  }

  const requestData: UpdateProspectPayload = {
    prospect_demographics: {
      selector,
      url,
      params,
    },
    external_id: selector,
    // origin: 'LINK_CLICK',
  };

  onSubmit(requestData);
}

export function detectElementClicks(selectors: string[], onSubmit: (requestData: UpdateProspectPayload) => void) {
  if (!selectors || selectors.length === 0) {
    return () => {}; // Return empty cleanup function
  }

  const listeners = new Map<HTMLElement, Map<string, () => void>>();

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements?.forEach((element) => {
      attachDomListener(element as HTMLElement, selector, onSubmit, listeners);
    });
  });

  // Return cleanup function
  return () => {
    listeners.forEach((selectorMap, element) => {
      selectorMap.forEach((handler) => {
        element.removeEventListener('click', handler);
      });
    });
    listeners.clear();
  };
}

export function watchForNewElements(
  element_selectors: string[],
  onSubmit: (requestData: UpdateProspectPayload) => void,
) {
  const listeners = new Map<HTMLElement, Map<string, () => void>>();

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      mutation.addedNodes.forEach((node: Node) => {
        if (!(node instanceof Element)) {
          return;
        }

        element_selectors.forEach((selector) => {
          // Check if the added node itself matches the selector
          if (node.matches(selector)) {
            attachDomListener(node as HTMLElement, selector, onSubmit, listeners);
          }

          // Check for matching elements within the added node's children
          node.querySelectorAll(selector).forEach((element) => {
            attachDomListener(element as HTMLElement, selector, onSubmit, listeners);
          });
        });
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Return cleanup function
  return () => {
    observer.disconnect();
    listeners.forEach((selectorMap, element) => {
      selectorMap.forEach((handler) => {
        element.removeEventListener('click', handler);
      });
    });
    listeners.clear();
  };
}

function attachDomListener(
  element: HTMLElement,
  selector: string,
  onSubmit: (requestData: UpdateProspectPayload) => void,
  listeners: Map<HTMLElement, Map<string, () => void>>,
) {
  if (element && element instanceof HTMLElement) {
    // Create the click handler
    const clickHandler = () => {
      handleDomElementClick(element, selector, onSubmit);
    };

    // Store the listener reference for cleanup
    if (!listeners.has(element)) {
      listeners.set(element, new Map());
    }
    listeners.get(element)!.set(selector, clickHandler);

    element.addEventListener('click', clickHandler);
  }
}
