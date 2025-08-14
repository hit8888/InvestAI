import { useEffect } from 'react';

const useDelayedCallback = (onLoad?: () => void, delay: number = 1500) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoad?.();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onLoad]);
};

export default useDelayedCallback;
