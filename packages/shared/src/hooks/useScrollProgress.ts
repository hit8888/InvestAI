import { useState, useEffect } from 'react';

interface ScrollProgressResult {
  hasReachedThreshold: boolean;
  thresholdReachCount: number;
}

/**
 * Hook to track scroll progress and count threshold crossings
 * @param threshold - Percentage of page scroll (0-100) at which to trigger (default: 33)
 * @returns Object containing boolean for threshold reached and count of threshold crossings
 */
export const useScrollProgress = (threshold: number = 33): ScrollProgressResult => {
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const [thresholdReachCount, setThresholdReachCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Get the total scrollable height (total document height minus viewport height)
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Get current scroll position
      const currentScroll = window.scrollY;

      // Calculate current scroll percentage
      const scrollPercentage = (currentScroll / scrollableHeight) * 100;

      // Check if we've crossed the threshold
      const hasReached = scrollPercentage >= threshold;

      // If we've crossed the threshold in either direction
      if (hasReached !== hasReachedThreshold) {
        setHasReachedThreshold(hasReached);
        if (hasReached) {
          // Only increment when crossing upward
          setThresholdReachCount((prev) => prev + 1);
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Run once to check initial position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, hasReachedThreshold]);

  return {
    hasReachedThreshold,
    thresholdReachCount,
  };
};
