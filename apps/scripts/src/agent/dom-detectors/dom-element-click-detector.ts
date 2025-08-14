import { DomElementClickConfigType, ProspectRequestData } from "../lib/types";
import { submitProspect } from "./api";

export function initDomElementClickDetection({
  track_clicks,
  element_selectors,
}: DomElementClickConfigType) {
  if (track_clicks) {
    detectElementClicks(element_selectors);
    watchForNewElements(element_selectors);
  }
}

function detectElementClicks(selectors: string[]) {
  if (!selectors || selectors.length === 0) {
    return;
  }

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements?.forEach((element) => {
      attachDomListener(element as HTMLElement, selector);
    });
  });
}

function watchForNewElements(element_selectors: string[]) {
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node: Node) => {
          if (node instanceof Element) {
            // if the added node matches any of the selectors
            const newElemsWithSelector = element_selectors
              .map((selector) => ({
                selector,
                element: node.matches(selector) ? node : null,
              }))
              .filter(({ element }) => element !== null);

            newElemsWithSelector.forEach((newElem) => {
              attachDomListener(
                newElem.element as HTMLElement,
                newElem.selector,
              );
            });

            // if the added node contains elements that match any of the selectors
            const newElemsWithSelectorInChildren = element_selectors
              .map((selector) => ({
                selector,
                elements: node.querySelectorAll(selector),
              }))
              .filter(({ elements }) => elements.length > 0);

            newElemsWithSelectorInChildren.forEach((newElem) => {
              newElem.elements.forEach((childNode: Element) => {
                attachDomListener(childNode as HTMLElement, newElem.selector);
              });
            });
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function attachDomListener(element: HTMLElement, selector: string) {
  if (element && element instanceof HTMLElement) {
    element.addEventListener("click", () => {
      handleDomElementClick(element, selector);
    });
  }
}

function handleDomElementClick(element: HTMLElement, selector: string) {
  const url = new URL(
    (element as HTMLAnchorElement).href || (element as HTMLImageElement).src,
  );
  let params = null;

  if (url) {
    params = Object.fromEntries(url.searchParams);
  }

  const requestData: ProspectRequestData = {
    prospect_demographics: {
      selector,
      url,
      params,
    },
    external_id: selector,
    origin: "LINK_CLICK",
  };

  submitProspect(requestData);
}
