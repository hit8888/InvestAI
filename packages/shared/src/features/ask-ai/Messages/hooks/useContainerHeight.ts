import { useRef, useState, useEffect, useCallback } from 'react';

export const useContainerHeight = (renderableMessagesLength: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  // Calculate container height with better accuracy
  const updateContainerHeight = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      // Use the actual available height minus padding
      setContainerHeight(Math.max(0, rect.height - 24)); // 24px for padding (p-3 = 12px top + 12px bottom)
    }
  }, []);

  useEffect(() => {
    updateContainerHeight();

    // Add resize observer for better responsiveness
    const resizeObserver = new ResizeObserver(() => {
      updateContainerHeight();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [renderableMessagesLength, updateContainerHeight]);

  return {
    containerRef,
    containerHeight,
  };
};
