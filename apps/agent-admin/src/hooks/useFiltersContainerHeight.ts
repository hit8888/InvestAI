import { useEffect, useState, useCallback } from 'react';

export const useFiltersContainerHeight = () => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  const filtersRef = useCallback((element: HTMLDivElement) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (node) {
      const updateHeight = () => {
        setHeight(node.offsetHeight);
      };

      updateHeight();

      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(node);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [node]);

  return { filtersRef, height };
};
