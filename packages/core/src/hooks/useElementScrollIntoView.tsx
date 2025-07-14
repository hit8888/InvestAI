import { useEffect, useRef } from 'react';
import { scrollIntoViewWithOptions } from '../utils/scrollUtils';

interface UseElementScrollIntoViewOptions {
  // When to trigger the scroll
  shouldScroll?: boolean;
  // Custom scroll options
  scrollOptions?: ScrollIntoViewOptions;
  // Delay before scrolling (in ms)
  delay?: number;
}

const defaultScrollOptions: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'center',
  inline: 'nearest',
};

const useElementScrollIntoView = <T extends HTMLElement>({
  shouldScroll = true,
  scrollOptions = defaultScrollOptions,
  delay = 0,
}: UseElementScrollIntoViewOptions = {}) => {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (shouldScroll && elementRef.current) {
      const timeoutId = setTimeout(() => {
        const element = elementRef.current;
        if (!element) return;

        try {
          // Try the normal scrollIntoView first
          setTimeout(() => {
            scrollIntoViewWithOptions(element, scrollOptions);
          }, 0);
        } catch (error) {
          // If that fails, try a simple fallback
          console.warn('scrollIntoView failed, using fallback:', error);
          try {
            element.scrollIntoView();
          } catch (fallbackError) {
            console.warn('scrollIntoView failed, using fallback:', fallbackError);
            // Last resort: manually scroll the element into view
            const rect = element.getBoundingClientRect();
            const container = document.getElementById('agent-messages-container') || document.documentElement;

            if (container && container !== document.documentElement) {
              container.scrollTop = container.scrollTop + rect.top - 100; // 100px offset
            } else {
              window.scrollTo({
                top: window.pageYOffset + rect.top - 100,
                behavior: 'smooth',
              });
            }
          }
        }
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldScroll, delay]);

  return elementRef;
};

export default useElementScrollIntoView;
