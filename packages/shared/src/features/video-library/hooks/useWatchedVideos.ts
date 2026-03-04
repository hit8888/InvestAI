import { useCallback, useState, useEffect } from 'react';
import { getLocalStorageData, setLocalStorageData } from '@neuraltrade/core/utils/storage-utils';

export const useWatchedVideos = () => {
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);

  // Load watched videos from localStorage on mount
  useEffect(() => {
    const storageData = getLocalStorageData();
    const storedWatchedVideos = storageData?.watchedVideos || [];
    setWatchedVideos(storedWatchedVideos);
  }, []);

  const addWatchedVideo = useCallback(
    (videoId: string) => {
      if (!watchedVideos.includes(videoId)) {
        const updatedWatchedVideos = [...watchedVideos, videoId];
        setWatchedVideos(updatedWatchedVideos);

        // Also update localStorage
        setLocalStorageData({ watchedVideos: updatedWatchedVideos });
      }
    },
    [watchedVideos],
  );

  const isVideoWatched = useCallback(
    (videoId: string): boolean => {
      return watchedVideos.includes(videoId);
    },
    [watchedVideos],
  );

  return {
    watchedVideos,
    addWatchedVideo,
    isVideoWatched,
  };
};
