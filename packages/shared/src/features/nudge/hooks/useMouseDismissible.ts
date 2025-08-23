import { useState, useEffect, useCallback } from 'react';

interface UseMouseDismissibleProps {
  displayDuration?: number;
  onDismiss?: () => void;
}

export const useMouseDismissible = ({ displayDuration, onDismiss }: UseMouseDismissibleProps) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [shouldDismiss, setShouldDismiss] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsMouseOver(false);
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    if (!displayDuration || displayDuration <= 0) {
      return;
    }

    setShouldDismiss(false);
    setIsMouseOver(false);

    const timeout = setTimeout(() => {
      setShouldDismiss(true);
    }, displayDuration);

    return () => clearTimeout(timeout);
  }, [displayDuration]);

  useEffect(() => {
    if (!isMouseOver && shouldDismiss) {
      onDismiss?.();
    }
  }, [isMouseOver, onDismiss, shouldDismiss]);

  return {
    isMouseOver,
    setIsMouseOver,
    handleDismiss,
  };
};
