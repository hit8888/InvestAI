import { useRef, useEffect, useState } from 'react';

export const useFiltersContainerHeight = () => {
  const filtersRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (filtersRef.current) {
        setHeight(filtersRef.current.offsetHeight);
      }
    };

    // Initial measurement
    updateHeight();

    // Set up ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (filtersRef.current) {
      resizeObserver.observe(filtersRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [filtersRef.current, setHeight]);

  return { filtersRef, height };
};
