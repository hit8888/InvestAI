import { RefObject, useEffect } from 'react';

interface UseScrollSyncProps {
  tableBodyRef: RefObject<HTMLDivElement | null>;
  headerRef: RefObject<HTMLDivElement | null>;
  isHeaderSticky: boolean;
  lastScrollPosition: { current: number };
  onScroll?: (scrollLeft: number) => void;
}

export const useScrollSync = ({
  tableBodyRef,
  headerRef,
  isHeaderSticky,
  lastScrollPosition,
  onScroll,
}: UseScrollSyncProps) => {
  useEffect(() => {
    const handleTableScroll = (event: Event) => {
      const target = event.target as HTMLDivElement;
      const scrollLeft = target.scrollLeft;
      lastScrollPosition.current = scrollLeft; // Update last known scroll position

      // Sync scroll position between header and body
      if (event.target === tableBodyRef.current && headerRef.current) {
        headerRef.current.scrollLeft = scrollLeft;
      } else if (event.target === headerRef.current && tableBodyRef.current) {
        tableBodyRef.current.scrollLeft = scrollLeft;
      }

      onScroll?.(scrollLeft);
    };

    tableBodyRef.current?.addEventListener('scroll', handleTableScroll);
    headerRef.current?.addEventListener('scroll', handleTableScroll);

    // Initial scroll position restoration for sticky header
    if (isHeaderSticky && lastScrollPosition.current > 0) {
      requestAnimationFrame(() => {
        if (headerRef.current) {
          headerRef.current.scrollLeft = lastScrollPosition.current;
        }
        if (tableBodyRef.current) {
          tableBodyRef.current.scrollLeft = lastScrollPosition.current;
        }
      });
    }

    return () => {
      tableBodyRef.current?.removeEventListener('scroll', handleTableScroll);
      headerRef.current?.removeEventListener('scroll', handleTableScroll);
    };
  }, [tableBodyRef, headerRef, isHeaderSticky, lastScrollPosition, onScroll]);
};
