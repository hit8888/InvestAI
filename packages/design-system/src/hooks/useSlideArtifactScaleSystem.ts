import { useRef, useState, useEffect } from 'react';

interface ScaleOptions {
  targetWidth?: number;
  targetHeight?: number;
}

export const useSlideArtifactScaleSystem = ({ targetWidth = 1600, targetHeight = 900 }: ScaleOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = (container: HTMLElement) => {
      const rect = container.getBoundingClientRect();
      return Math.min(rect.width / targetWidth, rect.height / targetHeight);
    };

    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setScale(calculateScale(entry.target as HTMLElement));
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [targetWidth, targetHeight]);

  return { containerRef, scale };
};
