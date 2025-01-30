// Intersection observer for header stickiness
// And preserve the scroll position during the sticky transition.
import { RefObject, useEffect } from 'react';

interface UseHeaderIntersectionProps {
  headerRef: RefObject<HTMLDivElement | null>;
  tableBodyRef: RefObject<HTMLDivElement | null>;
  lastScrollPosition: { current: number };
  onIntersectionChange: (isSticky: boolean) => void;
}

export const useHeaderIntersection = ({
  headerRef,
  tableBodyRef,
  lastScrollPosition,
  onIntersectionChange,
}: UseHeaderIntersectionProps) => {
  useEffect(() => {
    const options = {
      threshold: [0], // Detect as soon as it starts leaving
      rootMargin: '-72px', // Push top boundary down
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const willBeSticky = !entry.isIntersecting;

        if (willBeSticky) {
          // Store current scroll position before becoming sticky
          lastScrollPosition.current = tableBodyRef.current?.scrollLeft || 0;
        }

        onIntersectionChange(willBeSticky);

        // Restore scroll position after becoming sticky
        if (willBeSticky) {
          requestAnimationFrame(() => {
            if (headerRef.current) {
              headerRef.current.scrollLeft = lastScrollPosition.current;
            }
            if (tableBodyRef.current) {
              tableBodyRef.current.scrollLeft = lastScrollPosition.current;
            }
          });
        }
      });
    }, options);

    const sentinel = document.querySelector('.header-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [onIntersectionChange]);
};
