import { useState, useRef, useEffect } from 'react';

interface UseVideoDurationReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoDuration: number | null;
  formatDuration: (seconds: number) => string;
  handleVideoLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}

export const useVideoDuration = (): UseVideoDurationReturn => {
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    if (video.duration) {
      setVideoDuration(video.duration);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        if (video.duration) {
          setVideoDuration(video.duration);
        }
      };

      video.addEventListener('loadeddata', handleLoadedData);
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, []);

  return {
    videoRef,
    videoDuration,
    formatDuration,
    handleVideoLoadedMetadata,
  };
};
