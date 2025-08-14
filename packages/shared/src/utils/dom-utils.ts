/**
 * Utility functions for DOM queries that work in both regular DOM and Shadow DOM contexts
 */

import { ENV } from '../constants/env';

/**
 * Finds an element by selector in both regular DOM and Shadow DOM contexts
 * @param selector - CSS selector to find the element
 * @param webComponentTag - Optional web component tag name
 * @returns The found element or null
 */
export function querySelector(selector: string, webComponentTag = ENV.VITE_WC_TAG_NAME): Element | null {
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

/**
 * Finds multiple elements by selector in both regular DOM and Shadow DOM contexts
 * @param selector - CSS selector to find the elements
 * @param webComponentTag - Optional web component tag name
 * @returns Array of found elements
 */
export function querySelectorAll(selector: string, webComponentTag = ENV.VITE_WC_TAG_NAME): Element[] {
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

/**
 * Gets an element by ID in both regular DOM and Shadow DOM contexts
 * @param id - Element ID to find
 * @param webComponentTag - Optional web component tag name
 * @returns The found element or null
 */
export function getElementById(id: string, webComponentTag = ENV.VITE_WC_TAG_NAME): Element | null {
  return querySelector(`#${id}`, webComponentTag);
}

/**
 * Gets elements by class name in both regular DOM and Shadow DOM contexts
 * @param className - Class name to find
 * @param webComponentTag - Optional web component tag name
 * @returns Array of found elements
 */
export function getElementsByClassName(className: string, webComponentTag = ENV.VITE_WC_TAG_NAME): Element[] {
  return querySelectorAll(`.${className}`, webComponentTag);
}

/**
 * Gets the bounding client rect of an element, working in both contexts
 * @param selector - CSS selector to find the element
 * @param webComponentTag - Optional web component tag name
 * @returns The bounding client rect or null if element not found
 */
export function getBoundingClientRect(selector: string, webComponentTag = ENV.VITE_WC_TAG_NAME): DOMRect | null {
  const element = querySelector(selector, webComponentTag);
  return element?.getBoundingClientRect() || null;
}

/**
 * Checks if we're currently in a web component context
 * @param webComponentTag - Optional web component tag name
 * @returns True if we're in a web component context
 */
export function isInWebComponentContext(webComponentTag = ENV.VITE_WC_TAG_NAME): boolean {
  const host = document.querySelector(webComponentTag);
  return !!host?.shadowRoot;
}
