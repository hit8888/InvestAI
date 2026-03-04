import { SUGGESTED_QUESTIONS_INTERVAL_DURATION_IN_CYCLE_IN_MS } from '@neuraltrade/core/constants/index';
import { useState, useEffect } from 'react';

type UseCycleProps = {
  itemsLength: number;
  isEnabled?: boolean;
  showItems?: boolean;
  intervalDuration?: number;
  initialIndex?: number;
  cycleOnlyOnce?: boolean;
};

export const useCycle = ({
  itemsLength,
  isEnabled = true,
  showItems = true,
  intervalDuration = SUGGESTED_QUESTIONS_INTERVAL_DURATION_IN_CYCLE_IN_MS,
  initialIndex = 0,
  cycleOnlyOnce = false,
}: UseCycleProps) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(initialIndex);
  const [cycleCompleted, setCycleCompleted] = useState(false);

  useEffect(() => {
    if (isEnabled && showItems && !cycleCompleted) {
      const interval = setInterval(() => {
        setCurrentItemIndex((prev) => {
          const nextIndex = prev < itemsLength - 1 ? prev + 1 : 0;

          // If cycling only once and we've reached the end of all items, mark cycle as completed
          if (cycleOnlyOnce) {
            // For single item, complete after first interval
            if (itemsLength === 1) {
              setCycleCompleted(true);
            }
            // For multiple items, complete when we've cycled back to the beginning
            else if (nextIndex === 0 && prev === itemsLength - 1) {
              setCycleCompleted(true);
            }
          }

          return nextIndex;
        });
      }, intervalDuration);

      return () => clearInterval(interval);
    }
  }, [isEnabled, showItems, itemsLength, intervalDuration, cycleCompleted, cycleOnlyOnce]);

  return { currentItemIndex, cycleCompleted };
};
