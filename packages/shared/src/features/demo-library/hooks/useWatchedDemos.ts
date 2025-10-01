import { useState, useCallback } from 'react';

export const useWatchedDemos = () => {
  const [watchedDemos, setWatchedDemos] = useState<string[]>([]);

  const addWatchedDemo = useCallback((demoId: string) => {
    setWatchedDemos((prev) => {
      if (!prev.includes(demoId)) {
        return [...prev, demoId];
      }
      return prev;
    });
  }, []);

  const isDemoWatched = useCallback(
    (demoId: string) => {
      return watchedDemos.includes(demoId);
    },
    [watchedDemos],
  );

  return {
    watchedDemos,
    addWatchedDemo,
    isDemoWatched,
  };
};
