/**
 * Utility functions for DOM queries that work in both regular DOM and Shadow DOM contexts
 */

export function querySelector(selector: string, webComponentTag: string): Element | null {
  // Try Shadow DOM first
  const host = document.querySelector(webComponentTag);
  const shadowRoot = host?.shadowRoot;
  const shadowElement = shadowRoot?.querySelector(selector);

  if (shadowElement) {
    return shadowElement;
  }

  // Fallback to regular DOM
  return document.querySelector(selector);
}

export function querySelectorAll(selector: string, webComponentTag: string): Element[] {
  const elements: Element[] = [];

  // Try Shadow DOM first
  const host = document.querySelector(webComponentTag);
  const shadowRoot = host?.shadowRoot;
  const shadowElements = shadowRoot?.querySelectorAll(selector);

  if (shadowElements) {
    elements.push(...Array.from(shadowElements));
  }

  // Add regular DOM elements
  const regularElements = document.querySelectorAll(selector);
  elements.push(...Array.from(regularElements));

  return elements;
}

export function getElementById(id: string, webComponentTag: string): Element | null {
  return querySelector(`#${id}`, webComponentTag);
}

export function getElementsByClassName(className: string, webComponentTag: string): Element[] {
  return querySelectorAll(`.${className}`, webComponentTag);
}

export function getBoundingClientRect(selector: string, webComponentTag: string): DOMRect | null {
  const element = querySelector(selector, webComponentTag);
  return element?.getBoundingClientRect() || null;
}

export function getShadowRoot(webComponentTag: string): ShadowRoot | null {
  const host = document.querySelector(webComponentTag);
  return host?.shadowRoot || null;
}
