export const scrollIntoViewWithOptions = (
  element: HTMLElement | null,
  options: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  },
) => {
  if (!element) return;

  // Simple mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
    navigator.userAgent,
  );

  // Use instant scroll on mobile to avoid smooth scrolling issues
  const finalOptions = isMobile ? { ...options, behavior: 'auto' as ScrollBehavior } : options;

  // Check if we're inside an iframe
  const isInIframe = checkIfInIframe();

  if (isInIframe) {
    // Custom scroll implementation for iframe content
    scrollElementIntoViewInIframe(element, finalOptions);
  } else {
    // Use native scrollIntoView for non-iframe contexts
    try {
      element.scrollIntoView(finalOptions);
    } catch (error) {
      // Fallback for browsers that don't support scrollIntoView options
      console.warn('scrollIntoView with options failed, using fallback:', error);
      element.scrollIntoView();
    }
  }
};

/**
 * Custom scroll implementation that respects iframe boundaries
 * and prevents parent page scrolling
 */
const scrollElementIntoViewInIframe = (element: HTMLElement, options: ScrollIntoViewOptions) => {
  // Find the scrollable container within the iframe
  const scrollableContainer = findScrollableContainer(element);

  if (!scrollableContainer) {
    // Fallback to native scrollIntoView if no scrollable container found
    try {
      element.scrollIntoView(options);
    } catch (error) {
      console.warn('Fallback scrollIntoView failed:', error);
      element.scrollIntoView();
    }
    return;
  }

  const containerRect = scrollableContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // Calculate scroll adjustments
  let scrollTop = scrollableContainer.scrollTop;
  let scrollLeft = scrollableContainer.scrollLeft;

  // Handle vertical scrolling
  if (options.block !== 'nearest') {
    const elementTop = elementRect.top - containerRect.top;
    const elementBottom = elementRect.bottom - containerRect.top;
    const containerHeight = containerRect.height;

    if (options.block === 'start' || options.block === 'center') {
      // Scroll element to top or center of container
      const targetTop =
        options.block === 'center' ? elementTop - containerHeight / 2 + elementRect.height / 2 : elementTop;

      scrollTop = scrollableContainer.scrollTop + targetTop;
    } else if (options.block === 'end') {
      // Scroll element to bottom of container
      const targetTop = elementBottom - containerHeight;
      scrollTop = scrollableContainer.scrollTop + targetTop;
    }
  }

  // Handle horizontal scrolling
  if (options.inline !== 'nearest') {
    const elementLeft = elementRect.left - containerRect.left;
    const elementRight = elementRect.right - containerRect.left;
    const containerWidth = containerRect.width;

    if (options.inline === 'start' || options.inline === 'center') {
      // Scroll element to left or center of container
      const targetLeft =
        options.inline === 'center' ? elementLeft - containerWidth / 2 + elementRect.width / 2 : elementLeft;

      scrollLeft = scrollableContainer.scrollLeft + targetLeft;
    } else if (options.inline === 'end') {
      // Scroll element to right of container
      const targetLeft = elementRight - containerWidth;
      scrollLeft = scrollableContainer.scrollLeft + targetLeft;
    }
  }

  // Apply the scroll with smooth behavior
  try {
    if (options.behavior === 'smooth') {
      scrollableContainer.scrollTo({
        top: scrollTop,
        left: scrollLeft,
        behavior: 'smooth',
      });
    } else {
      scrollableContainer.scrollTop = scrollTop;
      scrollableContainer.scrollLeft = scrollLeft;
    }
  } catch (error) {
    // Fallback for browsers that don't support smooth scrolling
    console.warn('Smooth scrolling not supported, using instant scroll:', error);
    scrollableContainer.scrollTop = scrollTop;
    scrollableContainer.scrollLeft = scrollLeft;
  }
};

/**
 * Find the nearest scrollable container for the element
 */
const findScrollableContainer = (element: HTMLElement): HTMLElement | null => {
  let current = element.parentElement;

  while (current) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    // Check if this element is scrollable
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll') {
      // Verify it's actually scrollable by checking scroll dimensions
      if (current.scrollHeight > current.clientHeight || current.scrollWidth > current.clientWidth) {
        return current;
      }
    }

    // Stop at iframe boundary
    if (current.tagName === 'IFRAME') {
      break;
    }

    current = current.parentElement;
  }

  // If no scrollable container found, return the document element
  return document.documentElement;
};

/**
 * Check if the current context is inside an iframe
 */
export const checkIfInIframe = (): boolean => {
  try {
    return window !== window.parent;
  } catch (e) {
    // If we can't access window.parent due to cross-origin restrictions,
    // we're likely in an iframe
    console.error('checkIfInIframe', e);
    return true;
  }
};
