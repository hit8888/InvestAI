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
        scrollIntoViewWithOptions(elementRef.current, scrollOptions);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldScroll, delay]);

  return elementRef;
};

export default useElementScrollIntoView;
