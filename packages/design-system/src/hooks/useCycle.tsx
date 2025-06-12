import { SUGGESTED_QUESTIONS_INTERVAL_DURATION_IN_CYCLE_IN_MS } from '@meaku/core/constants/index';
import { useState, useEffect } from 'react';

type UseCycleProps = {
  itemsLength: number;
  isEnabled?: boolean;
  showItems?: boolean;
  intervalDuration?: number;
  initialIndex?: number;
};

export const useCycle = ({
  itemsLength,
  isEnabled = true,
  showItems = true,
  intervalDuration = SUGGESTED_QUESTIONS_INTERVAL_DURATION_IN_CYCLE_IN_MS,
  initialIndex = 0,
}: UseCycleProps) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(initialIndex);

  useEffect(() => {
    if (isEnabled && showItems) {
      const interval = setInterval(() => {
        setCurrentItemIndex((prev) => (prev < itemsLength - 1 ? prev + 1 : 0));
      }, intervalDuration);

      return () => clearInterval(interval);
    }
  }, [isEnabled, showItems, itemsLength, intervalDuration]);

  return { currentItemIndex };
};
