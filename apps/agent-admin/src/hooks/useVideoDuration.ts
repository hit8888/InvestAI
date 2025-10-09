import { useState, useRef, useEffect } from 'react';

interface UseVideoDurationReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoDuration: number | null;
  handleVideoLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement | HTMLIFrameElement>) => void;
}

export const useVideoDuration = (): UseVideoDurationReturn => {
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement | HTMLIFrameElement>) => {
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
    handleVideoLoadedMetadata,
  };
};
