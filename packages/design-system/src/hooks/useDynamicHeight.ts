import { useRef, useEffect, useState } from 'react';

const EXTRA_HEIGHT = 70;

interface UseDynamicHeightProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies?: any[];
}

export const useDynamicHeight = ({ dependencies = [] }: UseDynamicHeightProps) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  // Measure heights and set max height
  useEffect(() => {
    const measureHeights = () => {
      const heights = itemRefs.current
        .filter((ref) => ref !== null)
        .map((ref) => ref?.getBoundingClientRect().height || 0);

      const maxItemHeight = Math.max(...heights);
      setMaxHeight(maxItemHeight + EXTRA_HEIGHT); // taking some extra height to avoid overflow
    };

    // Measure after a short delay to ensure DOM is fully rendered
    const timer = setTimeout(measureHeights, 100);

    // Also measure on window resize
    window.addEventListener('resize', measureHeights);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureHeights);
    };
  }, dependencies);

  const setItemRef = (index: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[index] = el;
  };

  return {
    maxHeight,
    setItemRef,
  };
};
