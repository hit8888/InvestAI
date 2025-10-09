import { useState, useEffect, useRef } from 'react';

interface UseVideoUrlDurationProps {
  videoUrl: string | null;
  videoType: 'VIDEO' | 'EXTERNAL' | null;
  metadataDuration?: number | null;
  enabled?: boolean;
}

interface UseVideoUrlDurationReturn {
  duration: number | null;
  isLoading: boolean;
  error: Error | null;
  setDuration: (duration: number | null) => void;
}

/**
 * Hook to fetch video duration from a direct video URL
 * For external videos (YouTube, etc.), use this hook in combination with HiddenExternalVideoPlayer component
 *
 * @param videoUrl - The URL of the video
 * @param videoType - The type of video ('VIDEO' for direct video, 'EXTERNAL' for YouTube/Vimeo/etc.)
 * @param metadataDuration - Optional pre-existing duration from metadata to avoid re-fetching
 * @param enabled - Whether to fetch the duration (default: true)
 * @returns Object containing duration, loading state, error state, and a setter for external videos
 */
export const useVideoUrlDuration = ({
  videoUrl,
  videoType,
  metadataDuration,
  enabled = true,
}: UseVideoUrlDurationProps): UseVideoUrlDurationReturn => {
  const [duration, setDuration] = useState<number | null>(metadataDuration || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs for cleanup
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // If we already have a duration from metadata, use it
    if (metadataDuration && metadataDuration > 0) {
      setDuration(metadataDuration);
      setIsLoading(false);
      return;
    }

    // Reset state when inputs change
    if (!videoUrl || !videoType) {
      setDuration(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // For EXTERNAL videos, we don't handle them here - they need the HiddenExternalVideoPlayer component
    if (videoType === 'EXTERNAL') {
      setIsLoading(false);
      return;
    }

    // Handle direct video URLs (VIDEO type)
    if (videoType === 'VIDEO') {
      setIsLoading(true);
      setError(null);

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.style.position = 'absolute';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      video.style.width = '1px';
      video.style.height = '1px';
      video.style.zIndex = '-9999';

      videoElementRef.current = video;

      const handleLoadedMetadata = () => {
        if (mountedRef.current && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
          setDuration(video.duration);
          setIsLoading(false);
        }
      };

      const handleError = () => {
        if (mountedRef.current) {
          setError(new Error('Failed to load video metadata'));
          setIsLoading(false);
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);

      // Append to document to trigger loading
      document.body.appendChild(video);
      video.src = videoUrl;

      // Cleanup function
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
        videoElementRef.current = null;
      };
    }

    setIsLoading(false);
  }, [videoUrl, videoType, metadataDuration, enabled]);

  return {
    duration,
    isLoading,
    error,
    setDuration,
  };
};
