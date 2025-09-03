import { useCallback } from 'react';
import { getLocalStorageData, setLocalStorageData } from '@meaku/core/utils/storage-utils';

export const useWatchedVideos = () => {
  const getWatchedVideos = useCallback((): Set<string> => {
    const storageData = getLocalStorageData();
    const watchedVideos = storageData?.watchedVideos || [];
    return new Set(watchedVideos);
  }, []);

  const addWatchedVideo = useCallback(
    (videoId: string) => {
      const currentWatchedVideos = getWatchedVideos();
      if (!currentWatchedVideos.has(videoId)) {
        const updatedWatchedVideos = Array.from(currentWatchedVideos);
        updatedWatchedVideos.push(videoId);
        setLocalStorageData({ watchedVideos: updatedWatchedVideos });
      }
    },
    [getWatchedVideos],
  );

  const isVideoWatched = useCallback(
    (videoId: string): boolean => {
      return getWatchedVideos().has(videoId);
    },
    [getWatchedVideos],
  );

  return {
    getWatchedVideos,
    addWatchedVideo,
    isVideoWatched,
  };
};
