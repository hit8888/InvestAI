import { useEffect, useState, RefObject } from 'react';

interface UseHorizontalScrollDetectionProps {
  containerRef: RefObject<HTMLDivElement | null>;
  tableRef?: RefObject<HTMLTableElement | null>;
}

/**
 * Hook to detect if a table container needs horizontal scrolling
 * Returns true if the table content is wider than its container
 */
export const useHorizontalScrollDetection = ({ containerRef, tableRef }: UseHorizontalScrollDetectionProps) => {
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  useEffect(() => {
    const checkScrollNeed = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const table = tableRef?.current || container.querySelector('table');

      if (!table) return;

      // Check if table width exceeds container width
      const containerWidth = container.clientWidth;
      const tableWidth = table.scrollWidth;

      setNeedsHorizontalScroll(tableWidth > containerWidth);
    };

    // Initial check
    checkScrollNeed();

    // Check on window resize
    const handleResize = () => {
      checkScrollNeed();
    };

    window.addEventListener('resize', handleResize);

    // Use ResizeObserver if available for more accurate detection
    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(checkScrollNeed);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      // Also observe table changes if tableRef is provided
      if (tableRef?.current) {
        resizeObserver.observe(tableRef.current);
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [containerRef, tableRef]);

  return needsHorizontalScroll;
};
