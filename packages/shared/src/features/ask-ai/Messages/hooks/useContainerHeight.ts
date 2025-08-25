import { useRef, useState, useEffect } from 'react';

export const useContainerHeight = (renderableMessagesLength: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  // Calculate container height and min-height for last group
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      setContainerHeight(container.getBoundingClientRect().height - 32);
    }
  }, [renderableMessagesLength]);

  return {
    containerRef,
    containerHeight,
  };
};
